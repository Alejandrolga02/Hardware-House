import { Router } from "express";
import {
    renderPage,
    renderVentasDet
} from "../controllers/adminVentasControllers.js";

const router = Router();

//Administración de las ventas
router.get("/", renderPage);
router.get("/detalles/:id", renderVentasDet);


export default router;