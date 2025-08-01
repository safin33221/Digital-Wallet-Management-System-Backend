import { envVar } from "../../config/env.config";
import AppError from "../../errorHelpers/AppError";
import statusCode from "../../utils/statusCode";
import { Wallet } from "../wallet/wallet.model";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from 'bcryptjs'

const createUser = async (payload: Partial<IUser>) => {


    const isExistUser = await User.findOne({ email: payload.email })
    if (isExistUser) {
        throw new AppError(statusCode.BAD_REQUEST, "User already exist with this phone number")
    }

    const hashPassword = await bcryptjs.hash(payload.password as string, Number(envVar.BCRYPT_SLAT))

    const user = await User.create({
        ...payload,
        password: hashPassword,
    })


    const new_wallet = await Wallet.create({
        userId: user._id,
        balance: 100,

    })
    const updatedUser = await User.findByIdAndUpdate(user._id, { wallet: new_wallet._id }, { new: true })

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