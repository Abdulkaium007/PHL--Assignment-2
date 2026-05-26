import { Router } from "express";
import { issuesController } from "./issuesController";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../types/userTypes";


const router = Router();

router.post("/", auth(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.createIssue);
router.get("/", auth(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.getAllIssues);
router.get("/:id", auth(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.getSingleIssue);
router.put("/:id", auth(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.updateIssue);
router.delete("/:id", auth( USER_ROLE.maintainer), issuesController.deleteIssue);

export const issuesRoute = router;
