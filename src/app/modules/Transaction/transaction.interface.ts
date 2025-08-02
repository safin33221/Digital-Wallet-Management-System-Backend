import { Types } from "mongoose";

export enum ITransactionTypes {
    add_money = 'add_money',
    withdraw = 'withdraw',
    transfer = 'transfer',
    payment = 'payment',
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
    user: Types.ObjectId;
    type: ITransactionTypes
    amount: number;
    status: ITransactionStatus;
    paymentMethod: IPaymentMethods;
    transactionId: string;
    description?: string;
    approvedBy?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
