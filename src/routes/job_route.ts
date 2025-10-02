import { Router } from "express";
import { JobController } from "../controllers/job_controller";

const router = Router();

router.post("/", JobController.createJob);
router.get("/", JobController.getAllJobs);
router.patch("/:id/status", JobController.updateJobStatus);

router.get("/:id", JobController.getJobById);

export default router;
