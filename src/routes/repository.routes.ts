import { Router } from "express";
import { connectRepositoryController, getRepositoriesController } from "../controller/repository.controller.js";
const router = Router();


router.get("/", getRepositoriesController);
router.get("/",connectRepositoryController);
export default router;