import { Router } from "express";
import { JobController } from "../controllers/job_controller";

const router = Router();

router.post("/", JobController.createJob);
router.get("/", JobController.getAllJobs);

export default router;
