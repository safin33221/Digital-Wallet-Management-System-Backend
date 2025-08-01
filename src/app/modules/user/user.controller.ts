/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { userService } from "./user.service"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import statusCode from "http-status-codes"
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = await userService.createUser(req.body)
    sendResponse(res, {
        statusCode: statusCode.CREATED,
        success: true,
        message: "User created successfully",
        data: user

    })


})


export const userController = {
    createUser
}