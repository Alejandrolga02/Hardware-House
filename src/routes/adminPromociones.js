import { Router } from "express";
import { searchProducts } from "../controllers/adminProductsControllers.js";
import { 
    createPromotions,
    renderPromotions
} from "../controllers/adminPromotionsController.js";
import session from '../session.js';

const router = Router();

router.get("/", session.checkAdmin, renderPromotions)
//router.post("/", session.checkAdmin, searchPromotions);
router.post("/add", session.checkAdmin, createPromotions);

export default router;