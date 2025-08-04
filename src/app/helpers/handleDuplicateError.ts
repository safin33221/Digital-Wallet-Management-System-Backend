/* eslint-disable @typescript-eslint/no-explicit-any */

import { IGenericErrorResponse } from "../interface/error.type"


export const handleDuplicateError = (err: any): IGenericErrorResponse => {
    const matchArray = err.message.match(/"([^"]*)"/)
    return {

        statusCode: 400,
        message: `${matchArray[1]} already exist`
    }
}