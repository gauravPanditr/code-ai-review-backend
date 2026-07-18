import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import cors from "cors"
import "dotenv/config.js";
import { getContributionStat, getDashboardController, getMonthlyActivityController } from "./controller/dashboard.controller.js";
import { connectRepositoryController, getRepositoriesController } from "./controller/repository.controller.js";
import webhookRoutes from "./routes/webhook.routes.js";
import { inngestHandler } from "./inngest/index.js";


const app = express();

const port = 5000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.all("/api/auth/*", toNodeHandler(auth));


app.use("/api", webhookRoutes);

app.use("/api/dashboard", getDashboardController);
app.use("/api/contribution",getContributionStat);
app.use("/api/activity",getMonthlyActivityController)
app.use("/api/repository",getRepositoriesController);
app.use("/api/connectrespo",connectRepositoryController);
app.use("/api/inngest", inngestHandler);
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
  });
});
app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
});