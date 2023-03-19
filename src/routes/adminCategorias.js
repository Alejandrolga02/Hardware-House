import { Router } from "express";
import { 
    createCategories,
    renderCategories 
} from "../controllers/adminCategoriesController.js";
import session from '../session.js';

const router = Router();

router.get("/", session.checkAdmin, renderCategories)
router.post("/add", session.checkAdmin, createCategories);

export default router;