import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";
import { envVar } from "../config/env.config";

export const createToken = (user: Partial<IUser>) => {
    const JwtPayload: JwtPayload = {
        userId: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role
    }
    const accessToken = generateToken(JwtPayload, envVar.JWT_SECRET, envVar.JWT_EXPIRES_IN)
    const refreshToken = generateToken(JwtPayload, envVar.JWT_SECRET, envVar.JWT_REFRESH_EXPIRES_IN)

    return {
        accessToken,
        refreshToken
    }


}