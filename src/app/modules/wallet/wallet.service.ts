import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";

const getMyWallet = async (decodedToken: JwtPayload) => {
    const user = User.findOne({ phoneNumber: decodedToken.phoneNumber }).populate("wallet")
    return user
}

// const addMoney = async (payload, decodedToken: JwtPayload) => {
//     const user = User.findOne({ phoneNumber: decodedToken.phoneNumber }).populate("wallet")
// }

export const walletService = {
    getMyWallet
}