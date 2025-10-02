// controllers/PaymentController.ts
import { Request, Response } from "express";
import { PaymentService } from "../services/payment_service";
import { HttpStatus } from "../utils/constants/http_status";
import { ErrorType } from "../utils/constants/error_type";

export class PaymentController {
  static async createPayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      const result = await PaymentService.recordPayment(
        Number(id),
        Number(amount)
      );

      res.status(HttpStatus.CREATED).json({
        message: "Payment recorded successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(error.code || HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error.type || ErrorType.INTERNAL_ERROR,
        message: error.message,
      });
    }
  }
}
