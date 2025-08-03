/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import statusCode from "../../utils/statusCode";
import { sendResponse } from "../../utils/sendResponse";

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const login = await authService.credentialLogin(req.body)
    res.cookie("accessToken", login.accessToken, {
        httpOnly: true,
        secure: false
    })
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "User login successfully",
        data: {
            user: login.data,
            accessToken: login.accessToken
        }

    })
})
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "User logout successfully",
        data: null

    })
})

export const authController = {
    credentialLogin,
    logout
}