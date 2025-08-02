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
        paymentMethod: payload.paymentMethod


    })
    await Wallet.findByIdAndUpdate(user.wallet, { $inc: { balance: payload.amount }, lastTransaction: new Date() })
    const updatedTransaction = await Transaction.findByIdAndUpdate(transaction._id, { status: ITransactionStatus.success }, { new: true })

    return updatedTransaction

}

export const transactionService = {
    addMoney
}