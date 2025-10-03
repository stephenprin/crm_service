import { Router } from "express";
import { PaymentController } from "../controllers/payment_controller";

const router = Router();

router.post("/:invoice_id/payment", PaymentController.createPayment);

export default router;
