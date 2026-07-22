import { Router } from "express";
import { githubWebhookController } from "../controller/webhook.controller.js";

const router = Router();

router.post(
  "/github",
  githubWebhookController
);

export default router;