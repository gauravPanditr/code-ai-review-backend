import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import cors from "cors"
import "dotenv/config.js";
import { getContributionStat, getDashboardController, getMonthlyActivityController } from "./controller/dashboard.controller.js";
import { getRepositoriesController } from "./controller/repository.controller.js";
const app = express();
const port = 5000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.all("/api/auth/*", toNodeHandler(auth));


app.use(express.json());
app.use("/api/dashboard", getDashboardController);
app.use("/api/contribution",getContributionStat);
app.use("/api/activity",getMonthlyActivityController)
app.use("/api/repository",getRepositoriesController)
app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
});