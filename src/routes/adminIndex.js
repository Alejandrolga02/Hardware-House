import { Router } from "express";
import { renderIndex } from '../controllers/adminIndexController.js';
import { validarAdmin, validarJWT } from "../jwt.js";

const router = Router();

// Administración Productos
router.get("/", validarJWT, validarAdmin, renderIndex);

export default router;