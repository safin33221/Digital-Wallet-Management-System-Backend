/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { JwtPayload } from "jsonwebtoken"
import { walletService } from "./wallet.service"
import { sendResponse } from "../../utils/sendResponse"
import statusCode from "../../utils/statusCode"

const getMyWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const verifiedToken = req.user as JwtPayload
    const user = await walletService.getMyWallet(verifiedToken)
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Wallet Find successfully",
        data: user

    })


})
export const walletController = {
    getMyWallet
}