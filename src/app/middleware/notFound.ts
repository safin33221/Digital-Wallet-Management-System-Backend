import { Request, Response } from "express";
import getStatusCode from "http-status-codes";

export const notFound = (req: Request, res: Response) => {
    res.status(getStatusCode.NOT_FOUND).json({
        success: false,
        message: "Route not found"
    })
}