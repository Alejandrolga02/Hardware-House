import { Router } from "express";
import {
    createCategories,
    renderCategories
} from "../controllers/adminCategoriesController.js";

const router = Router();

router.get("/", renderCategories)
router.post("/add", createCategories);

export default router;