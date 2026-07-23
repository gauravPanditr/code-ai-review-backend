import { Router } from "express";
import {
  getDashboardController,
  getContributionStat,
  getMonthlyActivityController,
} from "../controller/dashboard.controller.js";
import { requireAuth } from "../middleware/auth.middlware.js";

const router = Router();

router.get("/", requireAuth,getDashboardController);
router.get("/contribution",requireAuth, getContributionStat);
router.get("/activity",requireAuth, getMonthlyActivityController);

export default router;