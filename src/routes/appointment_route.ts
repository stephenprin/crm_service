import { Router } from "express";
import { AppointmentController } from "../controllers/appointment_controller";

const router = Router();

router.post("/:id/appointments", AppointmentController.createAppointment);

export default router;
