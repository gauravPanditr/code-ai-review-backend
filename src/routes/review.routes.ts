import { Router } from "express";
import { getReviewsController } from "../controller/review.controller.js";


const router = Router();

router.get("/", getReviewsController);

export default router;