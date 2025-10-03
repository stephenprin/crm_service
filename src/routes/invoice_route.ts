import { Router } from "express";
import { InvoiceController } from "../controllers/invoice_controller";

const router = Router();

router.post("/:job_id/invoice", InvoiceController.createInvoice);

export default router;
