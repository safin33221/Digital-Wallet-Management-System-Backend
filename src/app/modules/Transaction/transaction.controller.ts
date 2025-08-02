/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import statusCode from "../../utils/statusCode"
import { transactionService } from "./transaction.service"
import { JwtPayload } from "jsonwebtoken"

const addMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const verifiedToken = req.user as JwtPayload
    const user = await transactionService.addMoney(req.body, verifiedToken)
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "User Updated successfully",
        data: user

    })


})


export const transactionController = {
    addMoney
}