/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import statusCode from "../../utils/statusCode";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const login = await authService.credentialLogin(req.body)
    res.cookie("accessToken", login.accessToken, {
        httpOnly: true,
        secure: false
    })
    res.cookie("refreshToken", login.refreshToken, {
        httpOnly: true,
        secure: false
    })
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "User login successfully",
        data: {
            accessToken: login.accessToken,
            refreshToken: login.refreshToken,
            user: login.user
        },

    })
})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req?.cookies?.refreshToken
   
    if (!refreshToken) {
        throw new AppError(statusCode.BAD_REQUEST, "No Refresh token received from cookies")
    }
    const tokenInfo = await authService.getNewAccessToken(refreshToken as string)



    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: 'New access token retrive successfully',
        data: tokenInfo,

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
    logout,
    getNewAccessToken
}