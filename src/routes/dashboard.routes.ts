import { Router } from "express";
import {
  getDashboardController,
  getContributionStat,
  getMonthlyActivityController,
} from "../controller/dashboard.controller.js";

const router = Router();

router.get("/", getDashboardController);
router.get("/contribution", getContributionStat);
router.get("/activity", getMonthlyActivityController);

export default router;