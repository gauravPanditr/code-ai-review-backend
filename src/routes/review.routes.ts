import { Router } from "express";
import { getReviewsController } from "../controller/review.controller.js";
import { requireAuth } from "../middleware/auth.middlware.js";


const router = Router();

router.get("/",requireAuth, getReviewsController);

export default router;