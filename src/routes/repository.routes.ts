import { Router } from "express";
import {
  connectRepositoryController,
  getRepositoriesController,
  getConnectedRepositoriesController,
  disConnectRepoController,
  disconnectAllReposController,
} from "../controller/repository.controller.js";
import { requireAuth } from "../middleware/auth.middlware.js";

const router = Router();

router.get("/",requireAuth, getRepositoriesController);

router.post(
  "/connect",requireAuth,
  connectRepositoryController
);

router.get(
  "/connected",requireAuth,
  getConnectedRepositoriesController
);

router.delete(
  "/disconnect",requireAuth,
  disConnectRepoController
);

router.delete(
  "/disconnect-all",requireAuth,
  disconnectAllReposController
);

export default router;