import { Types } from "mongoose";

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
    type: ITransactionTypes
    amount: number;
    status: ITransactionStatus;
    user?: Types.ObjectId;
    paymentMethod?: IPaymentMethods;
    transactionId: string;
    description?: string;
    approvedBy?: Types.ObjectId;

    to?: string;
    from?: string;

    agentNumber?: string;
    owner?: string
    createdAt?: Date;
    updatedAt?: Date;
}
