/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { userService } from "./user.service"
import statusCode from "http-status-codes"
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.createUser(req.body)
        res.status(201).json({
            success: true,
            message: "user create successful",
            data: user
        })
    } catch (error) { 
        console.log(error);
         res.status(201).json({
            success: false,
            message: "something is wrong",
            data: error
        })
    }

}

export const userController = {
    createUser
}