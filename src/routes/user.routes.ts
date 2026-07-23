import { Router } from "express";
import {
  getUserProfileController,
  updateUserProfileController,
} from "../controller/user.controller.js";
import { requireAuth } from "../middleware/auth.middlware.js";

const router = Router();

router.get("/profile", requireAuth,getUserProfileController);

router.patch(
  "/profile/update",
  updateUserProfileController
);

export default router;