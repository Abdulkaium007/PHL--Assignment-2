import type { Request, Response } from "express";
import { issuesService } from "./issuesService";
import sendResponse from "../../utility/sendResponse";
import { Result } from "pg";


const createIssue = async(req: Request, res: Response) => {
    try {
        const result = await issuesService.createIssueIntoDB(req.body);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully!",
            data: result.rows[0]
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create issue.";
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: errorMessage,
            data: error
        });
    }
};

const getAllIssues = async(req: Request, res: Response) => {
    try {
        const result = await issuesService.getAllIssuesFromDB();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issues retrieved successfully!",
            data: result.rows
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to retrieve issues.";
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: errorMessage,
            data: error
        });
    }
};

const getSingleIssue = async(req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await issuesService.getSingleIssueFromDB(id as string);
                if (result.rows.length===0){
            sendResponse (res,{
                statusCode: 404,
                success: false,
                message: "Issue not found!",
                data: {}
            })
        }

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue retrieved successfully!",
            data: result.rows[0]
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Failed to retrieve issue.";
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: errorMessage,
            data: error
        });
    }
};

const updateIssue = async(req: Request, res: Response)=>{
    const {id} = req.params;
    try{
        const result = await issuesService.updateIssueInDB(id as string, req.body)
        if (result.rows.length===0){
            sendResponse (res,{
                statusCode: 404,
                success: false,
                message: "Issue not found!",
                data: {}
            })
        }

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue updated successfully!",
            data: result.rows[0]
        })

    }catch(error: unknown){
        const errorMessage = error instanceof Error? error.message : "Faiiled to update issue!"
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: errorMessage,
            data: error
        })

    }
};

const deleteIssue = async(req: Request, res: Response)=>{
    const {id} = req.params;
    try{
        const result = await issuesService.deleteIssueFromDB(id as string);
        if(result.rows.length === 0) {
            sendResponse (res,{
                statusCode: 404,
                success: false,
                message: "Issue not found!",
                data: {}
            })
        }
        
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue deleted successfully!",
            data: result.rows[0]
        })

    }catch(error: unknown){
        const errorMessage = error instanceof Error? error.message : "Faiiled to delete issue!"
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: errorMessage,
            data: error
        })
    }

}

export const issuesController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue,
}