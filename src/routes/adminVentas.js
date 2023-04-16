import { Router } from "express";
import {
    renderPage,
    renderVentasDet,
    searchVentasId,
    searchVentasFecha
} from "../controllers/adminVentasControllers.js";
import { validarAdmin, validarJWT } from "../jwt.js";

const router = Router();

//Administración de las ventas
router.get("/", validarJWT, validarAdmin, renderPage);
router.post("/busqueda-id", validarJWT, validarAdmin, searchVentasId);
router.post("/busqueda-fecha", validarJWT, validarAdmin, searchVentasFecha);
router.get("/detalles/:id", validarJWT, validarAdmin, renderVentasDet);

export default router;