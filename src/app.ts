import express from "express";
import cors from "cors";
import customerRoutes from "./routes/customer_route";
import jobRoutes from "./routes/job_route";
import appointmentRoutes from "./routes/appointment_route";
import invoiceRoutes from "./routes/invoice_route";
import paymentRoutes from "./routes/payment_route";
import { errorHandler } from "./middlewares/error_handler";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/jobs", appointmentRoutes);
app.use("/customers", customerRoutes);
app.use("/jobs", jobRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/payment", paymentRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use(errorHandler);

app.get("/", (_req, res) => {
  res.send("CRM Backend Running");
});

export default app;
