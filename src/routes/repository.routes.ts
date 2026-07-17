import { Router } from "express";
import { getRepositoriesController } from "../controller/repository.controller.js";
const router = Router();


router.get("/", getRepositoriesController);
export default router;