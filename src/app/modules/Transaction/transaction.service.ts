import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import statusCode from "../../utils/statusCode";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { Transaction } from "./transaction.model";
import { ITransaction, ITransactionStatus, ITransactionTypes } from "./transaction.interface";

const getTransactionId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
}

const addMoney = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {

    if (payload.amount && payload?.amount <= 0) {
        throw new AppError(statusCode.BAD_REQUEST, "Invalid amount")

    }

    const user = await User.findOne({ phoneNumber: decodedToken.phoneNumber })
    if (!user) {
        throw new AppError(statusCode.NOT_FOUND, "user not found")
    }

    const transaction = await Transaction.create({
        user: user._id,
        type: ITransactionTypes.add_money,
        amount: payload.amount,
        status: ITransactionStatus.pending,
        transactionId: getTransactionId(),
        paymentMethod: payload.paymentMethod,



    })
    await Wallet.findByIdAndUpdate(user.wallet, { $inc: { balance: payload.amount }, lastTransaction: new Date() })
    const updatedTransaction = await Transaction.findByIdAndUpdate(transaction._id, { status: ITransactionStatus.success }, { new: true })

    return updatedTransaction

}


const sendMoney = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {

    if (payload.amount && payload?.amount <= 0) {
        throw new AppError(statusCode.BAD_REQUEST, "Invalid amount")

    }

    const sender = await User.findOne({ phoneNumber: decodedToken.phoneNumber })
    const receiver = await User.findOne({ phoneNumber: payload.to })
    if (!sender) {
        throw new AppError(statusCode.NOT_FOUND, "Sender not found")
    }
    if (!receiver) {
        throw new AppError(statusCode.NOT_FOUND, "Receiver not found")
    }


    await Wallet.findByIdAndUpdate(sender.wallet, { $inc: { balance: -Number(payload.amount) }, lastTransaction: new Date() });

    await Wallet.findByIdAndUpdate(receiver.wallet, { $inc: { balance: Number(payload.amount) }, lastTransaction: new Date() });
    const transaction = await Transaction.create({
        type: ITransactionTypes.transfer,
        amount: payload.amount,
        status: ITransactionStatus.success,
        transactionId: getTransactionId(),
        to: receiver.phoneNumber,
        from: sender.phoneNumber



    })
    return transaction




}

export const transactionService = {
    addMoney,
    sendMoney
}