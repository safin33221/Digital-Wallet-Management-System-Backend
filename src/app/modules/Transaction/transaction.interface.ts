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
export interface ITransaction {
    _id?: string;
    user: Types.ObjectId;
    type: ITransactionTypes
    amount: number;
    status: 'pending' | 'success' | 'failed';
    paymentMethod: IPaymentMethods;
    transactionId: string;
    description?: string;
    approvedBy?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
