import { Router } from "express";
import { searchProducts } from "../controllers/adminProductsControllers.js";
import {
    createPromotions,
    renderPromotions
} from "../controllers/adminPromotionsController.js";
import { validarAdmin, validarJWT } from "../jwt.js";

const router = Router();

router.get("/", validarJWT, validarAdmin, renderPromotions)
//router.post("/", validarJWT, validarAdmin, searchPromotions);
router.post("/add", validarJWT, validarAdmin, createPromotions);

export default router;