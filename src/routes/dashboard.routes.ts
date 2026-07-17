import { Router } from "express";
import { getContributionStat, getDashboardController, getMonthlyActivityController } from "../controller/dashboard.controller.js";

const router = Router();

router.get("/", getDashboardController);
router.get("/",getContributionStat);
router.get("/monthly", getMonthlyActivityController);

export default router;