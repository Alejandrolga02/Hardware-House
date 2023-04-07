import { Router } from "express";
import {
    createPromotions,
    renderPromotions,
    editPromotions,
    deletePromotions,
    searchPromotions
} from "../controllers/adminPromotionsController.js";
import { validarAdmin, validarJWT } from "../jwt.js";

const router = Router();

router.get("/", validarJWT, validarAdmin, renderPromotions)
router.post("/", validarJWT, validarAdmin, searchPromotions);
router.post("/add", validarJWT, validarAdmin, createPromotions);
router.get("/update/:id", validarJWT, validarAdmin, editPromotions);
router.get("/delete/:id", validarJWT, validarAdmin, deletePromotions);

export default router;