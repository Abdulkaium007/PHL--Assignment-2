import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.join(process.cwd(), '.env')
})

export const config = {
    port: process.env.PORT,
    connectionString: process.env.connectionString,
    secret: process.env.secret,
    refreshSecret: process.env.refreshSecret

};