import { Router } from "express";
import { renderIndex } from '../controllers/adminIndexController.js';

const router = Router();

// Administración Productos
router.get("/", renderIndex);

export default router;