import { Types } from "mongoose"

export interface IUserRole {
    ADMIN: "ADMIN",
    AGENT: "AGENT",
    USER: "USER"

}
export interface IUser {
    _id?: Types.ObjectId,
    walletID?: Types.ObjectId;
    name: string;
    email: string;
    phoneNumber?: string;
    nationalIdNumber: string;
    password: string;
    role: IUserRole;
    createdAt: Date;
    updatedAt: Date

}