import type { Request, Response } from "express";
import { userService } from "./userService";
import sendResponse from "../../utility/sendResponse";

const createUser = async (req: Request, res: Response) => {

    try {
        const result = await userService.createUserIntoDB(req.body);
        
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "User created successfully!",
            data: result.rows[0]
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create user.";
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: errorMessage,
            data: error
        });
    }
};

const getAllUsers = async (req: Request, res: Response) => {

    try {
        const result = await userService.getAllUsersFromDB();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Users retrieved successfully!",
            data: result.rows
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to retrieve users.";
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: errorMessage,
            data: error
        });
    }
};

const getSingleUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await userService.getSingleUserFromDB(id as string);

        if (result.rows.length === 0) {
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "User not found.",
                data: { }
            });
            return;
        }

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "User retrieved successfully!",
            data: result.rows[0]
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to retrieve user.";
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: errorMessage,
            data: error
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const loggedInUser = req.user;
    // console.log(loggedInUser);

    try {
        if(loggedInUser?.role === "contributor"){
            if(loggedInUser.id !== Number(id)){
                return sendResponse(res, {
                    statusCode:403,
                    success: false,
                    message: "Forbidden!!! You can only update your id",
                })
            }

        }

        const result = await userService.updateUserInDB(id as string, req.body);
        if(result.rows.length === 0) {
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "User not found.",
                data: { }
            });
            return;
        }
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "User updated successfully!",
            data: result.rows[0]
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update user.";
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: errorMessage,
            data: error
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;  

    try {
        const result = await userService.deleteUserFromDB(id as string);
        if(result.rows.length === 0) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "User not found.",
                data: { }
            });

        }
        sendResponse(res, {
            statusCode: 204,
            success: true,
            message: "User deleted successfully!",
            data:{}
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete user.";
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: errorMessage,
            data: error
        });
    }
};

export const userController = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
};