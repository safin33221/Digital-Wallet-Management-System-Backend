import { Types } from "mongoose"

export enum Role {
    ADMIN = "ADMIN",
    AGENT = "AGENT",
    USER = "USER"

}

export enum IUserStatus {
    BLOCKED = 'BLOCKED',
    UNBLOCK = 'UNBLOCK'
}
export interface IUser {
    _id?: Types.ObjectId,
    wallet?: Types.ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    nationalIdNumber?: string;
    password: string;
    role: Role;
    isVerified: boolean;
    status: IUserStatus;
    createdAt: Date;
    updatedAt: Date

}