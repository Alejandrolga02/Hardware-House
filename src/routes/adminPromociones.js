import { Router } from "express";
import { searchProducts } from "../controllers/adminProductsControllers.js";
import {
    createPromotions,
    renderPromotions,
    deletePromotions
} from "../controllers/adminPromotionsController.js";
import { validarAdmin, validarJWT } from "../jwt.js";

const router = Router();

router.get("/", validarJWT, validarAdmin, renderPromotions)
//router.post("/", validarJWT, validarAdmin, searchPromotions);
router.post("/add", validarJWT, validarAdmin, createPromotions);
router.get("/delete/:id", validarJWT, validarAdmin, deletePromotions);

export default router;