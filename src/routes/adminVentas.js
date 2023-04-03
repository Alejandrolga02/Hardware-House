import { Router } from "express";
import {
    renderPage,
    renderVentasDet
} from "../controllers/adminVentasControllers.js";
import { validarAdmin, validarJWT } from "../jwt.js";

const router = Router();

//Administración de las ventas
router.get("/", validarJWT, validarAdmin, renderPage);
router.get("/detalles/:id", validarJWT, validarAdmin, renderVentasDet);

export default router;