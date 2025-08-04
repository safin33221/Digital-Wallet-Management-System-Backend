/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env.config";
import AppError from "../errorHelpers/AppError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleZodError } from "../helpers/handleZodError";
import { IErrorSource } from "../interface/error.type";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVar.NODE_DEV === 'DEVELOPMENT') {
        console.log(err);
    }
    let statusCode = 500
    let message = `something went wrong`
    let errorSources: IErrorSource[] = []

    if (err.code === 1100) {
        const simplified = handleDuplicateError(err)
        statusCode = simplified.statusCode;
        message = simplified.message
    }
    else if (err.name === 'ZodError') {
        const simplified = handleZodError(err)
        statusCode = simplified.statusCode;
        message = simplified.message
        errorSources = simplified.errorSources as IErrorSource[]
    }
    else if (err.name === 'CastError') {
        const simplified = handleZodError(err)
        statusCode = simplified.statusCode;
        message = simplified.message
       
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    }

    else if (err instanceof Error) {
        statusCode = 500
        message = err.message
    }
    res.status(statusCode).json({
        success: false,
        message,
        error: err

    })

}