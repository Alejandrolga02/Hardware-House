import { Router } from "express";
import { renderIndex } from '../controllers/adminIndexController.js';
import session from '../session.js'

const router = Router();

// Administración Productos
router.get("/", session.checkAdmin, renderIndex);

export default router;