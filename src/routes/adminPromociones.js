import { Router } from "express";
import { searchProducts } from "../controllers/adminProductsControllers.js";
import {
    createPromotions,
    renderPromotions
} from "../controllers/adminPromotionsController.js";

const router = Router();

router.get("/", renderPromotions)
//router.post("/", searchPromotions);
router.post("/add", createPromotions);

export default router;