import { Router } from "express";
import { githubWebhookController } from "../controller/webhook.controller.js";
import { requireAuth } from "../middleware/auth.middlware.js";

const router = Router();

router.post(
  "/github",
  requireAuth,
  githubWebhookController
);

export default router;