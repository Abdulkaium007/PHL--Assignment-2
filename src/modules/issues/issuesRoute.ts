import { Router } from "express";
import { issuesController } from "./issuesController";


const router = Router();

router.post("/", issuesController.createIssue);
router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getSingleIssue);
router.put("/:id", issuesController.updateIssue);
router.delete("/:id", issuesController.deleteIssue);

export const issuesRoute = router;
