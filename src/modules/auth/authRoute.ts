import { Router } from "express";
import { authController } from "./authController";


const router = Router();

router.post("/login", authController.loginUser);
router.post("/refresh-token", authController.refreshAccessToken);

export const authRoute = router;