import bcrypt from "bcrypt";
import { pool } from "../../db/index";
import { config } from "../../config";
import jwt, { type JwtPayload } from "jsonwebtoken";

const loginUserIntoDB = async (payload: { email: string; password: string }) => {
    const { email, password } = payload;

    const userData = await pool.query(
        `SELECT * FROM users 
         WHERE email = $1`,
        [email]
    );

    if (userData.rows.length === 0) {
        throw new Error("Invalid Credentials!");
    }

    const user = userData.rows[0];
    const matchPassword = await bcrypt.compare(password, user.password)

    if(!matchPassword){
        throw new Error("Invalid Credentials!");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        
    }

    const accessToken = jwt.sign(jwtPayload, config.secret as string, {
        expiresIn: "1d"
    });

    const refreshToken = jwt.sign(jwtPayload, config.refreshSecret as string, {
        expiresIn: "10d"
    });

    return { accessToken, refreshToken };
};

const getRefreshToken = async (token: string) => {
    if (!token){
        throw new Error("Unauthorized!");
    }

    const decoded = jwt.verify(token as string, 
        config.refreshSecret as string) as JwtPayload;

    const userData = await pool.query(
        `SELECT * FROM users WHERE email=$1`, [decoded.email],
    );

        if(userData.rows.length === 0){
        throw new Error("User not found!")
    };

    const user = userData.rows[0];

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }

    const accessToken = jwt.sign(jwtPayload, config.secret as string, {
        expiresIn: "1d",
    });    

    return { accessToken };
}

export const authService = {
    loginUserIntoDB,
    getRefreshToken
}