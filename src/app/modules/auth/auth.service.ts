import AppError from "../../errorHelpers/AppError";
import statusCode from "../../utils/statusCode";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from 'bcryptjs';
import { createNewAccessTokenWithRefreshToken, createToken } from "../../utils/userToken";


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

    const userToken = createToken(user)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...userInfo } = user.toObject()
    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: userInfo
    }

}
const getNewAccessToken = async (refreshToken: string) => {

    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return { accessToken: newAccessToken }
}






export const authService = {
    credentialLogin,
    getNewAccessToken

}