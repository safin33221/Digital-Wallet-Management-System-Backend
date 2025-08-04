/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose"
import { IGenericErrorResponse } from "../interface/error.type"


export const handleCastError = (err: mongoose.Error.CastError): IGenericErrorResponse => {
    return {
        statusCode: 400,
        message: "Invalid Object Id . Please provide a valid Id"
    }
}