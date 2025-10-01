import { Router } from "express";
import { CustomerController } from "../controllers/customer_controller";

const router = Router();

router.post("/", CustomerController.createCustomer);
router.get("/:id", CustomerController.createCustomer);

export default router;
