import { Router } from "express";
import { 
    renderPromotions 
} from "../controllers/adminPromotionsController.js";
import session from '../session.js';

const router = Router();

router.get("/", session.checkAdmin, renderPromotions)

export default router;