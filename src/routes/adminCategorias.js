import { Router } from "express";
import {
    createCategories,
    renderCategories,
    deleteCategories,
    searchCategories
} from "../controllers/adminCategoriesController.js";
import { validarAdmin, validarJWT } from "../jwt.js";

const router = Router();

router.get("/", validarJWT, validarAdmin, renderCategories);
router.post("/", validarJWT, validarAdmin, searchCategories);
router.post("/add", validarJWT, validarAdmin, createCategories);
router.get("/delete/:id", validarJWT, validarAdmin, deleteCategories);

export default router;