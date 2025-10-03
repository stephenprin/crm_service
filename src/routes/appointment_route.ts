import { Router } from "express";
import { AppointmentController } from "../controllers/appointment_controller";

const router = Router();

router.post("/:job_id/appointment", AppointmentController.createAppointment);

export default router;
