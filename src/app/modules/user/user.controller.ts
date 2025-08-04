/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { userService } from "./user.service"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import statusCode from "http-status-codes"
import { JwtPayload } from "jsonwebtoken"
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = await userService.createUser(req.body)
    sendResponse(res, {
        statusCode: statusCode.CREATED,
        success: true,
        message: "User created successfully",
        data: user

    })


})
const getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const users = await userService.getUser()
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "User Get successfully",
        data: users.users,
        meta: {
            total: users.totalUser
        }

    })


})

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const verifiedToken = req.user as JwtPayload
    const user = await userService.getMe(verifiedToken)
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "User Get successfully",
        data: user
    })
})

const updatedUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId
    const verifiedToken = req.user as JwtPayload
    const user = await userService.updateUser(userId, req.body, verifiedToken)
    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "User Updated successfully",
        data: user

    })


})




export const userController = {
    createUser,
    getUsers,
    updatedUser,
    getMe
}