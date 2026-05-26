import type { Request, Response } from "express";
import { authService } from "./authService";
import sendResponse from "../../utility/sendResponse";


const registerUser = async(req: Request, res: Response) => {
    try {
        const result = await authService.regusterUserIntoDB(req.body);
        return sendResponse(res, {
            statusCode: 201,
            success: true, 
            message: "User registered successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        const errorMessage = error instanceof Error? error.message: "Failed to register!";
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: errorMessage,
            error: error
        });
        
    };
};

const loginUser = async (req: Request, res: Response)=>{
    try {
        const result = await authService.loginUserIntoDB(req.body);

        const {refreshToken} = result;

        res.cookie("refreshToken", refreshToken, {
            secure: false,
            httpOnly: true,
            sameSite: "lax",
        });
        
        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "User login successfully!",
            data: result
        })

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message: "Failed to login!";
        return sendResponse(res, {
            statusCode: 401,
            success: false,
            message: errorMessage,
            error: error
        });
    };

};

const refreshAccessToken = async (req: Request, res: Response)=> {
    try {
        const result = await authService.getRefreshToken(req.cookies.refreshToken);

        return sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Access token generated!",
            data: result,
        });
    } catch (error) {
        const errorMessage = error instanceof Error? error.message: "Failed to generate access token!";
        return sendResponse(res,{
            statusCode: 401,
            success: false,
            message: errorMessage,
            error: error,
        });
    }

};

export const authController = {
    loginUser,
    refreshAccessToken,
    registerUser
}