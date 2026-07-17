import { Router } from "express";
import { connectRepositoryController, getRepositoriesController } from "../controller/repository.controller.js";
const router = Router();


router.get("/", getRepositoriesController);
router.post("/",connectRepositoryController);
export default router;