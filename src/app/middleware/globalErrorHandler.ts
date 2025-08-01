/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env.config";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVar.NODE_DEV === 'DEVELOPMENT') {
        console.log(err);
    }
    let statusCode = 500
    let message = `something went wrong`

    res.status(statusCode).json({
        success:false,
        message,
        error:err

    })

}