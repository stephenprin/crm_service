import { Router } from "express";
import { InvoiceController } from "../controllers/invoice_controller";

const router = Router();

router.post("/jobs/:id/invoice", InvoiceController.createInvoice);

export default router;
