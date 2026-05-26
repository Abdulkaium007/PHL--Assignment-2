import type { Request, Response } from "express";
import { issuesService } from "./issuesService";
import sendResponse from "../../utility/sendResponse";
import { Result } from "pg";
import { pool } from "../../db/index";


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
        const sort = req.query.sort as string;
        const result = await issuesService.getAllIssuesFromDB(sort);
        const allIssues = result.rows;

        const reporterInfo = await pool.query(
            `SELECT id, name, role FROM users`
        );

        const reporterMap = new Map();

        reporterInfo.rows.map((reporter) => {
            reporterMap.set(reporter.id, reporter);
        });

        const formattedIssues = allIssues.map((issue) => {
            return {
                id: issue.id,
                title: issue.title,
                description: issue.description,
                type: issue.type,
                status: issue.status,

                reporter: reporterMap.get(issue.reporter_id),

                created_at: issue.created_at,
                updated_at: issue.updated_at,
            };
        });
        // console.log(formattedIssues);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issues retrieved successfully!",
            data: formattedIssues
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

        const reporterInfo = await pool.query(
            `SELECT id, name, role FROM users WHERE id = $1`, [result.rows[0].reporter_id],
        );
        // console.log(reporterInfo.rows[0]); 
        const formatedIssue = {
            id: result.rows[0].id,
            title: result.rows[0].title,
            description: result.rows[0].description,
            type: result.rows[0].type,
            status: result.rows[0].status,
            reporter: reporterInfo.rows[0],
            created_at: result.rows[0].created_at,
            updated_at: result.rows[0].updated_at,

        }
        // console.log(formatedIssue);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue retrieved successfully!",
            data: formatedIssue
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
    const loggedInUser = req.user;

    try{
        const existingIssue = await issuesService.getSingleIssueFromDB(id as string)
        if (existingIssue.rows.length===0){
            sendResponse (res,{
                statusCode: 404,
                success: false,
                message: "Issue not found!",
                data: {}
            })
        }

        if (loggedInUser?.role === "contributor") {

            if (existingIssue.rows[0].reporter_id !== loggedInUser.id) {
                return sendResponse(res, {
                    statusCode: 403,
                    success: false,
                    message: "You can only update your own issue",
                });
            }

            if (existingIssue.rows[0].status !== "open") {
                return sendResponse(res, {
                    statusCode: 409,
                    success: false,
                    message: "Issue already in progress or closed",
                });
            }
            
            if (req.body.status) {
                return sendResponse(res, {
                    statusCode: 403,
                    success: false,
                    message: "Contributors cannot change issue status",
                });
            }
        }

        const result = await issuesService.updateIssueInDB(id as string, req.body)

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
            statusCode: 204,
            success: true,
            message: "Issue deleted successfully!",
            data: {}
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