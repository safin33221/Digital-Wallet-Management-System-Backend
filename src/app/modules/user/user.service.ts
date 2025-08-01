import AppError from "../../errorHelpers/AppError";
import statusCode from "../../utils/statusCode";
import { Wallet } from "../wallet/wallet.model";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {


    const isExistUser = await User.findOne({ email: payload.email })
    if (isExistUser) {
        throw new AppError(statusCode.BAD_REQUEST, "User already exist with this phone number")
    }

    const user = await User.create(payload)


    const wallet = await Wallet.create({
        userId: user._id,
        balance: 100,

    })
    const updatedUser = await User.findByIdAndUpdate(user._id, { wallet: wallet._id }, { new: true })

    return updatedUser

}

const getUser = async () => {
    const users = await User.find({}).populate("wallet")

    const totalUser = await User.countDocuments()
    return {
        users,
        totalUser
    }
}

export const userService = {
    createUser,
    getUser
}