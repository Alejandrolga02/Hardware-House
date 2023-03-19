import { Router } from "express";
import { renderCategories } from "../controllers/adminCategoriesController.js";
import session from '../session.js';

const router = Router();

router.get("/", session.checkAdmin, renderCategories)

export default router;