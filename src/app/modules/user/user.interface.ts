import { Types } from "mongoose"

export enum Role {
    ADMIN = "ADMIN",
    AGENT = "AGENT",
    USER = "USER"

}
export interface IUser {
    _id?: Types.ObjectId,
    walletID?: Types.ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    nationalIdNumber?: string;
    password: string;
    role: Role;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date

}