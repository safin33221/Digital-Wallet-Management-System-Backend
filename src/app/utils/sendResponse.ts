import { Response } from "express";


interface IMeta {
    total: number
}

interface IResponse<T> {
    statusCode: number;
    success: boolean;
    message: string
    data: T;
    meta?: IMeta
}

export const sendResponse = <T>(res: Response, data: IResponse<T>) => {
    res.status(data.statusCode).json({
        status: data.statusCode,
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data
    })
}