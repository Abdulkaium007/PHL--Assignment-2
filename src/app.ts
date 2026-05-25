
import express, { type Application, type Request, type Response } from "express";
import { userRoute } from "./modules/users/userRoute";
import { issuesRoute } from "./modules/issues/issuesRoute";
import cookieParser from "cookie-parser";
import { authRoute } from "./modules/auth/authRoute";

const app : Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the API!"
    });
});

app.use("/api/users", userRoute);
app.use("/api/issues", issuesRoute);
app.use("/api/auth", authRoute);

export default app;