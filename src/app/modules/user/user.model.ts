import { model, Schema } from "mongoose";
import { IUser, IUserStatus, Role } from "./user.interface";

const userSchema = new Schema<IUser>({
    wallet: {
        type: Schema.Types.ObjectId,
        ref: "Wallet",
        unique: true,
    },
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    nationalIdNumber: {
        type: String,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: Object.values(Role),
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date(),

    },
    status: {
        type: String,
        enum: Object.values(IUserStatus),
        default: IUserStatus.UNBLOCK
    },

    // Only relevant for AGENT
    approved: { type: Boolean, default: false },
    commissionRate: { type: Number },

    // For admins
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },


}, {
    timestamps: true,

})

export const User = model<IUser>("User", userSchema)