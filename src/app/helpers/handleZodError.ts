/* eslint-disable @typescript-eslint/no-explicit-any */
import { IErrorSource, IGenericErrorResponse } from "../interface/error.type";

export const handleZodError = (err: any): IGenericErrorResponse => {
    const errorSources: IErrorSource[] = []
    
    err.issues.forEach((issue: any) => {
        errorSources.push({
            path: issue.path.length > 1 && issue.path.reverse().join("inside"),
            message: issue.message,
            
        })
    });
    console.log(errorSources);
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources
    }
}