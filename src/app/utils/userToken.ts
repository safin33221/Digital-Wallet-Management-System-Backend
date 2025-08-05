import { JwtPayload } from "jsonwebtoken";
import { IUser, IUserStatus } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { envVar } from "../config/env.config";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";
import statusCode from "./statusCode";

export const createToken = (user: Partial<IUser>) => {
    const JwtPayload: JwtPayload = {
        userId: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role
    }
    const accessToken = generateToken(JwtPayload, envVar.JWT_SECRET, envVar.JWT_EXPIRES_IN)
    const refreshToken = generateToken(JwtPayload, envVar.JWT_REFRESH_SECRET, envVar.JWT_REFRESH_EXPIRES_IN)

    return {
        accessToken,
        refreshToken
    }


}



export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedToken = verifyToken(refreshToken, envVar.JWT_REFRESH_SECRET) as JwtPayload

    const user = await User.findOne({ phoneNumber: verifiedToken.phoneNumber })
    if (!user) {
        throw new AppError(statusCode.BAD_REQUEST, "phone number does not exist")
    }

    if (user.status === IUserStatus.BLOCKED) {
        throw new AppError(statusCode.BAD_REQUEST, `Use is ${user.status}`)
    }

    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    }
    const accessToken = generateToken(jwtPayload, envVar.JWT_SECRET, envVar.JWT_EXPIRES_IN)
    return accessToken
}



