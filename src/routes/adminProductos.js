import { Router } from "express";
import {
	createProducts,
	deleteProducts,
	editProducts,
	renderProducts,
	updateProducts,
} from "../controllers/adminProductsControllers.js";
import session from '../session.js'

const router = Router();

// Administración Productos
router.get("/", session.checkAdmin, renderProducts);
router.post("/add/", session.checkAdmin, createProducts);
router.get("/update/:id", session.checkAdmin, editProducts);
router.post("/update/:id", session.checkAdmin, updateProducts);
router.get("/delete/:id", session.checkAdmin, deleteProducts);

export default router;