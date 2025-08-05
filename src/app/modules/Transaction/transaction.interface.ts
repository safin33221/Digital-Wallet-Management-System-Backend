import { Schema, Types } from "mongoose";

export enum ITransactionTypes {
    add_money = 'add_money',
    withdraw = 'withdraw',
    transfer = 'transfer',
    payment = 'payment',
    cashIn = 'cashIn',
    cashOut = 'cashOut',
}

export enum IPaymentMethods {
    card = 'card',
    bank = 'bank',
    bkash = 'bkash',
    nagad = 'nagad',
    rocket = 'rocket',
    manual = 'manual',
}

export enum ITransactionStatus {
    pending = 'pending',
    success = 'success',
    failed = 'failed',
}
export interface ITransaction {
    _id?: string;
    type?: ITransactionTypes
    amount: number;
    status?: ITransactionStatus;

    userId?: Types.ObjectId;
    password: string
    userPhone: string;

    paymentMethod?: IPaymentMethods;
    transactionId: string;
    description?: string;
    approvedBy?: Types.ObjectId;

    toUserId?: Schema.Types.ObjectId;
    toUserPhone?: string;

    createdAt?: Date;
    updatedAt?: Date;
}
