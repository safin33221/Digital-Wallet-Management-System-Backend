/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import statusCode from "../../utils/statusCode";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { Transaction } from "./transaction.model";
import { ITransaction, ITransactionStatus, ITransactionTypes } from "./transaction.interface";
import { IUserStatus, Role } from "../user/user.interface";
import { getTransactionId } from "../../utils/transactionId";
import bcryptjs from "bcryptjs";

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


const checkPass = async (payloadPassword: string, userPassword: string) => {
    const password = await bcryptjs.compare(payloadPassword, userPassword)
    if (!password) {
        throw new AppError(statusCode.BAD_REQUEST, "Invalid Password")
    }
}
// ──────── Services ───────── //

const addMoney = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {
    validateAmount(payload.amount);
    const user = await findUserByPhone(decodedToken.phoneNumber);
    await checkPass(payload.password as string, user.password)


    const transaction = await Transaction.create({
        userId: user._id,
        userPhone: user.phoneNumber,
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

    const user = await findUserByPhone(decodedToken.phoneNumber, "user not found");
    await checkPass(payload.password as string, user.password)

    const receiver = await findUserByPhone(payload.toUserPhone as string, "Receiver not found");
    if (receiver.status === IUserStatus.BLOCKED) {
        throw new AppError(statusCode.FORBIDDEN, `The account (${receiver.phoneNumber}) is blocked.`)
    }

    if (receiver.role !== Role.USER) {
        throw new AppError(statusCode.FORBIDDEN, `You are not permitted to send money on any agent.`)

    }

    const userBalance = (user.wallet as any).balance;
    if (userBalance < (payload.amount as number)) {
        throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance");
    }

    await updateWalletBalance(user.wallet, -(payload.amount as number));
    await updateWalletBalance(receiver.wallet, payload.amount as number);

    return await Transaction.create({
        userId: user._id,
        userPhone: user.phoneNumber,
        type: ITransactionTypes.transfer,
        amount: payload.amount,
        status: ITransactionStatus.success,
        transactionId: getTransactionId(),
        toUserPhone: receiver.phoneNumber,
        toUserId: receiver._id,
    });
};

const withdrawMoney = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {
    validateAmount(payload.amount);

    const user = await findUserByPhone(decodedToken.phoneNumber, "User not found");
    await checkPass(payload.password as string, user.password)



    const agent = await findUserByPhone(payload.toUserPhone as string, "Agent not found");
    if (agent.role !== Role.AGENT) {
        throw new AppError(statusCode.BAD_REQUEST, "This number is not registered as an agent");
    }
    if (!agent.approved) {
        throw new AppError(statusCode.BAD_REQUEST, "your account is not approved as an agent yet")

    }

    const userBalance = (user.wallet as any).balance;
    if (userBalance < (payload.amount as number)) {
        throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance");
    }

    await updateWalletBalance(user.wallet, -(payload.amount as number));
    await updateWalletBalance(agent.wallet, payload.amount as number);

    return await Transaction.create({
        userId: user._id,
        userPhone: user.phoneNumber,
        type: ITransactionTypes.withdraw,
        amount: payload.amount,
        status: ITransactionStatus.success,
        transactionId: getTransactionId(),
        toUserId: agent._id,
        toUserPhone: agent.phoneNumber,
    });
};

const cashIn = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {
    validateAmount(payload.amount);

    //Agent 
    const user = await findUserByPhone(decodedToken.phoneNumber, "Agent not found");
    await checkPass(payload.password as string, user.password)
    if (!user.approved) {
        throw new AppError(statusCode.BAD_REQUEST, "your account is not approved as an agent yet")

    }

    //Customer
    const customer = await findUserByPhone(payload.toUserPhone as string, "User not found");

    await updateWalletBalance(user.wallet, -(payload.amount as number));
    await updateWalletBalance(customer.wallet, payload.amount as number);

    return await Transaction.create({
        userId: user._id,
        userPhone: user.phoneNumber,
        type: ITransactionTypes.cashIn,
        amount: payload.amount,
        status: ITransactionStatus.success,
        transactionId: getTransactionId(),
        toUserPhone: customer.phoneNumber,
        toUserId: customer._id,
    });
};

const cashOut = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {
    validateAmount(payload.amount);


    const user = await findUserByPhone(decodedToken.phoneNumber as string, "User not found");
    await checkPass(payload.password as string, user.password)



    const userBalance = (user.wallet as any).balance;
    if (userBalance < (payload.amount as number)) {
        throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance");
    }

    const agent = await findUserByPhone(payload.toUserPhone as string, "Agent not found");
    if (agent.role !== Role.AGENT) {
        throw new AppError(statusCode.NOT_FOUND, "Invalid agent number")
    }
    if (!agent.approved) {
        throw new AppError(statusCode.BAD_REQUEST, "your account is not approved as an agent yet")

    }

    await updateWalletBalance(user.wallet, -(payload.amount as number));
    await updateWalletBalance(agent.wallet, payload.amount as number);

    return await Transaction.create({
        userId: user._id,
        userPhone: user.phoneNumber,
        type: ITransactionTypes.cashOut,
        amount: payload.amount,
        status: ITransactionStatus.success,
        transactionId: getTransactionId(),
        toUserId: agent._id,
        toUserPhone: agent.phoneNumber,
    });
};

const transactionHistory = async (decodedToken: JwtPayload) => {
    const user = await findUserByPhone(decodedToken.phoneNumber, "User not found");
    return await Transaction.find({ userPhone: user.phoneNumber }).sort({ createdAt: -1 });
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
