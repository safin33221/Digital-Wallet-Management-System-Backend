/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

import { sendResponse } from "../../utils/sendResponse";
import statusCode from "../../utils/statusCode";
import { statService } from "./state.service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getUserStat = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await statService.getUserState()

    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "User Stat get Success",
        data: data

    })
})
const getTransactionStat = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await statService.getTransactionStat()

    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Transaction stat get Success",
        data: data

    })
})
export const statController = {
    getUserStat,
    getTransactionStat
}

