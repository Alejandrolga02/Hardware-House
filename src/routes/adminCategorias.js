import { Router } from "express";
import {
    createCategories,
    renderCategories
} from "../controllers/adminCategoriesController.js";
import { validarAdmin, validarJWT } from "../jwt.js";

const router = Router();

router.get("/", validarJWT, validarAdmin, renderCategories)
router.post("/add", validarJWT, validarAdmin, createCategories);

export default router;