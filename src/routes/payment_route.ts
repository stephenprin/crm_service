import { Router } from "express";
import { PaymentController } from "../controllers/payment_controller";

const router = Router();

router.post("/:invoice_id/create", PaymentController.createPayment);

export default router;
