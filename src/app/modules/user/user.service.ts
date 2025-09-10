/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../../config/env.config";
import AppError from "../../errorHelpers/AppError";
import statusCode from "../../utils/statusCode";
import { Wallet } from "../wallet/wallet.model";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from 'bcryptjs'
import { QueryBuilder } from "../../utils/QueryBuiler";
import { UserSearchableFields } from "./constants";

const createUser = async (payload: Partial<IUser>) => {

    const isExistUser = await User.findOne({ phoneNumber: payload.phoneNumber })
    if (isExistUser) {
        throw new AppError(statusCode.CONFLICT, "Already have an account in this phone number")
    }

    if (payload.role !== Role.USER && payload.role !== Role.AGENT) {
        throw new AppError(statusCode.BAD_REQUEST, "Invalid role! Choose between User or Agent")
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

const getUser = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(User.find()
        .populate("wallet").select("-password -__v")
        , query)


    const users = await queryBuilder
        .search(UserSearchableFields)
        .sort()
        .filter()
        .pagination()

    const [data, metaData] = await Promise.all([
        users.build(),
        users.getMetadata()
    ])
    return { metaData, data }


    // const users = await User.find(query).populate("wallet").select("-password -__v")


}

const getMe = async (decodedToken: JwtPayload) => {
    const user = await User.findOne({ phoneNumber: decodedToken.phoneNumber }).populate("wallet").select("-password -__v")
    if (!user) {
        throw new AppError(statusCode.NOT_FOUND, "user not found")
    }
    return user
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const user = await User.findById(userId)
    if (!user) {
        throw new AppError(statusCode.NOT_FOUND, "user not found")
    }
    if (payload.role || payload.isVerified || payload.status || payload.approved || payload.commissionRate) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(statusCode.UNAUTHORIZED, "Only Admin can change role, verified, status, approved or commission rate")
        }


    }

    if (payload.phoneNumber) {
        throw new AppError(statusCode.BAD_REQUEST, "You can't change phone number")
    }
    if (payload.password) {
        if (!payload.oldPassword) {
            throw new AppError(statusCode.BAD_REQUEST, "Old password required")
        }
        const matchPassword = await bcryptjs.compare(payload.oldPassword, user.password)
        if (!matchPassword) {
            throw new AppError(statusCode.UNAUTHORIZED, "Password doesn't match")
        }
        payload.password = await bcryptjs.hash(payload.password, Number(envVar.BCRYPT_SLAT))
        delete (payload as any).oldPassword
    }

    const updatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })
    return updatedUser
}

export const userService = {
    createUser,
    getUser,
    updateUser,
    getMe
}