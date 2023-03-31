import { Router } from "express";
import session from '../session.js';
import {
    renderPage
} from "../controllers/adminVentasControllers.js";

const router = Router();

//Administración de las ventas
router.get("/", session.checkAdmin, renderPage);


export default router;