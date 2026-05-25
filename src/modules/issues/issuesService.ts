import { pool } from "../../db/index";
import type { IIssue } from "./issuesInterface";


const createIssueIntoDB = async(payload: IIssue) => {
    const { title, description, type, status, reporter_id } = payload;

    const result = await pool.query(
        `INSERT INTO issues (title, description, type, status, reporter_id) 
        VALUES ($1, $2, $3, COALESCE($4, 'open'), $5) 
        RETURNING *`,
        [title, description, type, status, reporter_id]
    );
    return result;
};

const getAllIssuesFromDB = async() => {
    const result = await pool.query(
        `SELECT * FROM issues`
    );
    return result;
};

const getSingleIssueFromDB = async(id: string) => {
    const result = await pool.query(
        `SELECT * FROM issues
        WHERE id = $1`,
        [id]
    );
    return result;
};

const updateIssueInDB = async(id: string, payload: IIssue) => {
    const { title, description, type, status } = payload;
    const result = await pool.query(
        `UPDATE issues 
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            type = COALESCE($3, type),
            status = COALESCE($4, status)
        WHERE id = $5 
        RETURNING *`,
        [title, description, type, status, id]
    );
    return result;
}

const deleteIssueFromDB = async(id: string) => {
    const result = await pool.query(
        `DELETE FROM issues
        WHERE id = $1
        RETURNING *`,
        [id]
    );
    return result;
}

export const issuesService = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
    updateIssueInDB,
    deleteIssueFromDB
};