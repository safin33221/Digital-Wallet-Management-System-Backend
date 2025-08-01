import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { generateToken } from "../../utils/jwt";
import statusCode from "../../utils/statusCode";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from 'bcryptjs'
import { envVar } from "../../config/env.config";


const credentialLogin = async (payload: Partial<IUser>) => {
    const { phoneNumber, password } = payload
    const user = await User.findOne({ phoneNumber }).populate("wallet")
    if (!user) {
        throw new AppError(statusCode.NOT_FOUND, "User not found")
    }

    const matchPassword = await bcryptjs.compare(password as string, user?.password)
    if (!matchPassword) {
        throw new AppError(statusCode.UNAUTHORIZED, "Incorrect password")
    }
    const JwtPayload: JwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const userToken = generateToken(JwtPayload, envVar.JWT_SECRET, envVar.JWT_EXPIRES_IN)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...userInfo } = user.toObject()
    return {
        accessToken: userToken,
        data: userInfo

    }

}



export const authService = {
    credentialLogin
}