
import { Router } from "express";
import { userController } from "./userController";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../types/userTypes";

const router = Router();

router.post("/", userController.createUser);
router.get("/", auth(USER_ROLE.maintainer), userController.getAllUsers);
// router.get("/", userController.getAllUsers);
router.get("/:id", userController.getSingleUser);
router.put("/:id",auth(), userController.updateUser);
router.delete("/:id", auth(USER_ROLE.maintainer), userController.deleteUser);

export const userRoute = router;
