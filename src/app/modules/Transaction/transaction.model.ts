import { model, Schema } from "mongoose";
import { IPaymentMethods, ITransaction, ITransactionStatus, ITransactionTypes } from "./transaction.interface";



const transactionSchema = new Schema<ITransaction>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        type: {
            type: String,
            enum: Object.values(ITransactionTypes),
        },
        amount: {
            type: Number,
            required: true,
            min: 1,
        },
        status: {
            type: String,
            enum: Object.values(ITransactionStatus),
            default: ITransactionStatus.pending,
        },
        paymentMethod: {
            type: String,
            enum: Object.values(IPaymentMethods),
            required: true,
        },
        transactionId: {
            type: String,
            unique: true,
        },
        description: {
            type: String,
        },
        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: "User", // usually an admin or agent
        },
    },
    {
        timestamps: true,
    }
);

export const Transaction = model<ITransaction>("Transaction", transactionSchema);

