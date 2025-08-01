import { model, Schema } from "mongoose";
import { IUser, Role } from "./user.interface";

const userSchema = new Schema<IUser>({
    wallet: {
        type: Schema.Types.ObjectId,
        unique: true,
        ref:"Wallet"
    },
    name: {
        type: String
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
    

}, {
    timestamps: true,

})

export const User = model<IUser>("User", userSchema)