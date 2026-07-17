import { Router } from "express";
import { githubWebhookController } from "../controller/webhook.controller.js";

const router = Router();

router.post(
  "/webhooks/github",
  githubWebhookController
);

export default router;