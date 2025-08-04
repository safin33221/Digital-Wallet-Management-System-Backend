import { model, Schema } from "mongoose";
import { IWallet, kycStatus } from "./wallet.interface";


const walletSchema = new Schema<IWallet>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true
    },
    balance: {
        type: Number,

    },
    isFrozen: {
        type: Boolean,
        default: false
    },
    currency: {
        type: String,
        default: "BTD"
    },
    kycStatus: {
        type: String,
        enum: Object.values(kycStatus),
        default: kycStatus.NOT_VERIFIED
    },
    lastTransaction: {
        type: Date
    }

}, {
    timestamps: false
})

export const Wallet = model<IWallet>("Wallet", walletSchema)