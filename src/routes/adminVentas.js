import { Router } from "express";
import session from '../session.js';
import {
    renderPage,
    renderVentasDet
} from "../controllers/adminVentasControllers.js";

const router = Router();

//Administración de las ventas
router.get("/", session.checkAdmin, renderPage);
router.get("/detalles/:id", session.checkAdmin, renderVentasDet);


export default router;