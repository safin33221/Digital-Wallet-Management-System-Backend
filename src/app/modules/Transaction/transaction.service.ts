/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import statusCode from "../../utils/statusCode";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { Transaction } from "./transaction.model";
import { ITransaction, ITransactionStatus, ITransactionTypes } from "./transaction.interface";
import { Role } from "../user/user.interface";

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
        owner: user.phoneNumber,
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

    const sender = await User.findOne({ phoneNumber: decodedToken.phoneNumber }).populate('wallet')
    const receiver = await User.findOne({ phoneNumber: payload.to })
    if (!sender) {
        throw new AppError(statusCode.NOT_FOUND, "something went wrong")
    }
    if (!receiver) {
        throw new AppError(statusCode.NOT_FOUND, "No available account on this number")
    }
    const balance = (sender.wallet as any).balance
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (balance < payload.amount!) {
        throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance")
    }


    await Wallet.findByIdAndUpdate(sender.wallet, { $inc: { balance: -Number(payload.amount) }, lastTransaction: new Date() });

    await Wallet.findByIdAndUpdate(receiver.wallet, { $inc: { balance: Number(payload.amount) }, lastTransaction: new Date() });
    const transaction = await Transaction.create({
        user: sender._id,
        owner: sender.phoneNumber,
        type: ITransactionTypes.transfer,
        amount: payload.amount,
        status: ITransactionStatus.success,
        transactionId: getTransactionId(),
        to: receiver.phoneNumber,
        from: sender.phoneNumber



    })
    return transaction




}

const withdrawMoney = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {
    if (payload.amount && payload?.amount <= 0) {
        throw new AppError(statusCode.BAD_REQUEST, "Invalid amount")

    }

    const agent = await User.findOne({ phoneNumber: payload.agentNumber })
    const user = await User.findOne({ phoneNumber: decodedToken.phoneNumber }).populate('wallet')

    if (!agent) {
        throw new AppError(statusCode.NOT_FOUND, "Invalid Agents Number")

    }
    if (agent.role !== Role.AGENT) {
        throw new AppError(statusCode.BAD_REQUEST, "This number is not an agent")
    }
    if (!user) {
        throw new AppError(statusCode.NOT_FOUND, "something went wrong")
    }

    const balance = (user.wallet as any).balance
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (balance < payload.amount!) {
        throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance")
    }
    await Wallet.findByIdAndUpdate(user.wallet, { $inc: { balance: -Number(payload.amount) }, lastTransaction: new Date() });

    await Wallet.findByIdAndUpdate(agent.wallet, { $inc: { balance: Number(payload.amount) }, lastTransaction: new Date() });
    const transaction = await Transaction.create({
        user: user._id,
        owner: user.phoneNumber,
        type: ITransactionTypes.transfer,
        amount: payload.amount,
        status: ITransactionStatus.success,
        transactionId: getTransactionId(),
        to: agent.phoneNumber,
        from: user.phoneNumber



    })
    return transaction


}

const cashIn = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {
    const user = await User.findOne({ phoneNumber: payload.to }).populate('wallet')
    const agent = await User.findOne({ phoneNumber: decodedToken.phoneNumber }).populate('wallet')

    if (!user) {
        throw new AppError(statusCode.NOT_FOUND, 'No user found in this number')
    }
    if (!agent) {
        throw new AppError(statusCode.NOT_FOUND, 'something went wrong')

    }

    await Wallet.findByIdAndUpdate(agent.wallet, { $inc: { balance: -Number(payload.amount) }, lastTransaction: new Date() });

    await Wallet.findByIdAndUpdate(user.wallet, { $inc: { balance: Number(payload.amount) }, lastTransaction: new Date() });

    const transaction = await Transaction.create({
        user: user._id,
        owner: user.phoneNumber,
        type: ITransactionTypes.cashIn,
        amount: payload.amount,
        status: ITransactionStatus.success,
        transactionId: getTransactionId(),
        to: agent.phoneNumber,
        from: user.phoneNumber



    })
    return transaction

}

const transactionHistory = async (decodedToken: JwtPayload) => {
    const user = await User.findOne({ phoneNumber: decodedToken.phoneNumber }).populate('wallet')
    if (!user) {
        throw new AppError(statusCode.NOT_FOUND, "User not found")
    }
    const transactions = await Transaction.find({ owner: user.phoneNumber }).sort({ createdAt: -1 })
    return transactions
}

export const transactionService = {
    addMoney,
    sendMoney,
    withdrawMoney,
    transactionHistory,
    cashIn
}