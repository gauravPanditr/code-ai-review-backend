import { Router } from "express";
import { getDashboardController } from "../controller/dashboard.controller.js";

const router = Router();

router.get("/", getDashboardController);

export default router;