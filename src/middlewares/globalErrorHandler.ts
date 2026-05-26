import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utility/sendResponse";


const globalErrorHandler= (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    return sendResponse(res, {
        statusCode: 500,
        success: false,
        message: err.message || "Internal server error!",
    })
}

export default globalErrorHandler;