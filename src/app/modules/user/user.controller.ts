/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { userService } from "./user.service"
import statusCode from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = await userService.createUser(req.body)
    res.status(201).json({
        success: true,
        message: "user create successful",
        data: user
    })


})


export const userController = {
    createUser
}