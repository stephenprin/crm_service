import { Request, Response } from "express";
import { AppointmentService } from "../services/appointment_service";
import { ErrorType } from "../utils/constants/error_type";

export const AppointmentController = {
  async createAppointment(req: Request, res: Response) {
    try {
      const { technician, start_time, end_time } = req.body;
      const job_id = Number(req.params.job_id);
      console.log("Scheduling appointment for job ID:", job_id);

      const appointment = await AppointmentService.scheduleAppointment({
        job_id,
        technician,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
      });

      return res.status(201).json({ data: appointment });
    } catch (err: any) {
      if (err.code === ErrorType.APPOINTMENT_OVERLAP) {
        return res
          .status(409)
          .json({ error: { message: err.message, code: err.code } });
      }
      return res.status(500).json({
        error: {
          message: err.message,
          code: err.code || ErrorType.INTERNAL_ERROR,
        },
      });
    }
  },
};
