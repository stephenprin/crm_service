import express from "express";
import cors from "cors";
import customerRoutes from "./routes/customer_route";
import jobRoutes from "./routes/job_route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/customers", customerRoutes);
app.use("/jobs", jobRoutes);

app.get("/", (_req, res) => {
  res.send("🚀 CRM Backend Running with TypeScript");
});

export default app;
