
import express, { type Application, type Request, type Response } from "express";
import { userRoute } from "./modules/users/userRoute";
import { issuesRoute } from "./modules/issues/issuesRoute";

const app : Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the API!"
    });
});

app.use("/api/users", userRoute);
app.use("/api/issues", issuesRoute);

export default app;