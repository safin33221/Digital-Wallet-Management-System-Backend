/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import statusCode from "../../utils/statusCode";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { Transaction } from "./transaction.model";
import { ITransaction, ITransactionStatus, ITransactionTypes } from "./transaction.interface";
import { Role } from "../user/user.interface";
import { getTransactionId } from "../../utils/transactionId";

// ──────── Helpers ───────── //

const validateAmount = (amount?: number) => {
    if (!amount || amount <= 0) {
        throw new AppError(statusCode.BAD_REQUEST, "Invalid amount");
    }
};

const findUserByPhone = async (phone: string, message = "User not found") => {

    const user = await User.findOne({ phoneNumber: phone }).populate("wallet");
    if (!user) throw new AppError(statusCode.NOT_FOUND, message);
    return user;
};

const updateWalletBalance = async (walletId: any, amount: number) => {
    await Wallet.findByIdAndUpdate(walletId, {
        $inc: { balance: amount },
        lastTransaction: new Date(),
    });
};

// ──────── Services ───────── //

const addMoney = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {
    validateAmount(payload.amount);
    const user = await findUserByPhone(decodedToken.phoneNumber);

    const transaction = await Transaction.create({
        user: user._id,
        owner: user.phoneNumber,
        type: ITransactionTypes.add_money,
        amount: payload.amount,
        status: ITransactionStatus.pending,
        transactionId: getTransactionId(),
        paymentMethod: payload.paymentMethod,
    });

    await updateWalletBalance(user.wallet, payload.amount as number);

    return await Transaction.findByIdAndUpdate(
        transaction._id,
        { status: ITransactionStatus.success },
        { new: true }
    );
};

const sendMoney = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {
    validateAmount(payload.amount);

    const sender = await findUserByPhone(decodedToken.phoneNumber, "Sender not found");
    const receiver = await findUserByPhone(payload.to as string, "Receiver not found");

    const senderBalance = (sender.wallet as any).balance;
    if (senderBalance < (payload.amount as number)) {
        throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance");
    }

    await updateWalletBalance(sender.wallet, -(payload.amount as number));
    await updateWalletBalance(receiver.wallet, payload.amount as number);

    return await Transaction.create({
        user: sender._id,
        owner: sender.phoneNumber,
        type: ITransactionTypes.transfer,
        amount: payload.amount,
        status: ITransactionStatus.success,
        transactionId: getTransactionId(),
        from: sender.phoneNumber,
        to: receiver.phoneNumber,
    });
};

const withdrawMoney = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {
    validateAmount(payload.amount);

    const agent = await findUserByPhone(payload.agentNumber as string, "Agent not found");
    const user = await findUserByPhone(decodedToken.phoneNumber, "User not found");

    if (agent.role !== Role.AGENT) {
        throw new AppError(statusCode.BAD_REQUEST, "This number is not registered as an agent");
    }

    const userBalance = (user.wallet as any).balance;
    if (userBalance < (payload.amount as number)) {
        throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance");
    }

    await updateWalletBalance(user.wallet, -(payload.amount as number));
    await updateWalletBalance(agent.wallet, payload.amount as number);

    return await Transaction.create({
        user: user._id,
        owner: user.phoneNumber,
        type: ITransactionTypes.transfer,
        amount: payload.amount,
        status: ITransactionStatus.success,
        transactionId: getTransactionId(),
        from: user.phoneNumber,
        to: agent.phoneNumber,
    });
};

const cashIn = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {
    validateAmount(payload.amount);

    const user = await findUserByPhone(payload.to as string, "User not found");
    const agent = await findUserByPhone(decodedToken.phoneNumber, "Agent not found");

    await updateWalletBalance(agent.wallet, -(payload.amount as number));
    await updateWalletBalance(user.wallet, payload.amount as number);

    return await Transaction.create({
        user: user._id,
        owner: user.phoneNumber,
        type: ITransactionTypes.cashIn,
        amount: payload.amount,
        status: ITransactionStatus.success,
        transactionId: getTransactionId(),
        from: agent.phoneNumber,
        to: user.phoneNumber,
    });
};

const cashOut = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {
    validateAmount(payload.amount);

    const user = await findUserByPhone(payload.to as string, "User not found");
    const agent = await findUserByPhone(decodedToken.phoneNumber, "Agent not found");
    if (agent.role !== Role.AGENT) {
        throw new AppError(statusCode.NOT_FOUND, "Invalid agent number")
    }

    await updateWalletBalance(user.wallet, -(payload.amount as number));
    await updateWalletBalance(agent.wallet, payload.amount as number);

    return await Transaction.create({
        user: user._id,
        owner: user.phoneNumber,
        type: ITransactionTypes.cashOut,
        amount: payload.amount,
        status: ITransactionStatus.success,
        transactionId: getTransactionId(),
        from: user.phoneNumber,
        to: agent.phoneNumber,
    });
};

const transactionHistory = async (decodedToken: JwtPayload) => {
    const user = await findUserByPhone(decodedToken.phoneNumber, "User not found");
    return await Transaction.find({ owner: user.phoneNumber }).sort({ createdAt: -1 });
};

// ──────── Export ───────── //

export const transactionService = {
    addMoney,
    sendMoney,
    withdrawMoney,
    transactionHistory,
    cashIn,
    cashOut,
};
