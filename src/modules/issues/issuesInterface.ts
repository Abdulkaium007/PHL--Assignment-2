import type { ISSUE_STATUS, ISSUE_TYPES } from "../../types/issuesType";


export interface IIssue {
    title: string;
    description: string;
    type: ISSUE_TYPES;
    status?: ISSUE_STATUS;
    reporter_id?: string;
}