import { Types } from "mongoose";

export enum kycStatus {
    VERIFIED = "VERIFIED",
    NOT_VERIFIED = "NOT_VERIFIED"
}
export interface IWallet {
    _id?: Types.ObjectId;
    userId: string;
    balance: number;
    currency: string;
    isFrozen: boolean;
    kycStatus: kycStatus;
    lastTransaction: Date

}