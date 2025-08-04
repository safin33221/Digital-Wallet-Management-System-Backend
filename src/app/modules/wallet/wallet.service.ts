import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { Wallet } from "./wallet.model";

const getMyWallet = async (decodedToken: JwtPayload) => {
    const user = User.findOne({ phoneNumber: decodedToken.phoneNumber }).populate("wallet")
    return user
}

const getAllWallet = async () => {
    const allWallet = await Wallet.find({}).populate("userId")
    const totalWallet = await Wallet.countDocuments()

    return {
        allWallet,
        totalWallet
    }
}

export const walletService = {
    getMyWallet,
    getAllWallet
}