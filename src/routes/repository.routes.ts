import { Router } from "express";
import {
  connectRepositoryController,
  getRepositoriesController,
  getConnectedRepositoriesController,
  disConnectRepoController,
  disconnectAllReposController,
} from "../controller/repository.controller.js";

const router = Router();

router.get("/", getRepositoriesController);

router.post(
  "/connect",
  connectRepositoryController
);

router.get(
  "/connected",
  getConnectedRepositoriesController
);

router.delete(
  "/disconnect",
  disConnectRepoController
);

router.delete(
  "/disconnect-all",
  disconnectAllReposController
);

export default router;