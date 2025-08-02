/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import statusCode from "../../utils/statusCode"
import { transactionService } from "./transaction.service"
import { JwtPayload } from "jsonwebtoken"

const addMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const verifiedToken = req.user as JwtPayload
    const transaction = await transactionService.addMoney(req.body, verifiedToken)
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Money added successfully",
        data: transaction

    })


})
const sendMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const verifiedToken = req.user as JwtPayload
    const transaction = await transactionService.sendMoney(req.body, verifiedToken)
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Mony send successfully",
        data: transaction

    })


})
const withdrawMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const verifiedToken = req.user as JwtPayload
    const transaction = await transactionService.withdrawMoney(req.body, verifiedToken)
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Money withdrawn successfully",
        data: transaction

    })


})
const transactionHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const verifiedToken = req.user as JwtPayload
    const transactions = await transactionService.transactionHistory(verifiedToken)
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Transaction history retrieved successfully",
        data: transactions
    })
})



export const transactionController = {
    addMoney,
    sendMoney,
    withdrawMoney,
    transactionHistory
}