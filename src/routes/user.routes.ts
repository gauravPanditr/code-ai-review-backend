import { Router } from "express";
import {
  getUserProfileController,
  updateUserProfileController,
} from "../controller/user.controller.js";

const router = Router();

router.get("/profile", getUserProfileController);
router.put("/profile", updateUserProfileController);

export default router;