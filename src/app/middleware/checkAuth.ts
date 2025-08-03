import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import statusCode from "../utils/statusCode";
import { envVar } from "../config/env.config";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";
import { User } from "../modules/user/user.model";
import { IUserStatus } from "../modules/user/user.interface";


export const checkAuth = (...authRole: string[]) => async (req: Request, res: Response, next: NextFunction) => {

    try {

        const accessToken = req.headers.authorization
        if (!accessToken) {
            throw new AppError(statusCode.UNAUTHORIZED, "No token Received")
        }
        const verifiedToken = verifyToken(accessToken, envVar.JWT_SECRET) as JwtPayload
        req.user = verifiedToken

        const user = await User.findOne({ phoneNumber: verifiedToken.phoneNumber })

        if (!user) {
            throw new AppError(statusCode.NOT_FOUND, "User not found")
        }
        if (user.status === IUserStatus.BLOCKED) {
            throw new AppError(statusCode.FORBIDDEN, " Your wallet is blocked. Please contact support.")

        }

        if (!authRole.includes(verifiedToken.role)) {
            throw new AppError(statusCode.FORBIDDEN, "You'r not permitted to view this route")
        }
        next()

    } catch (error) {
        next(error)
    }
}