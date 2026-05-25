import type { ROLES } from "../../types/userTypes";

export interface IUser {
    name: string;
    email: string;
    role?: ROLES;
    password: string;

}