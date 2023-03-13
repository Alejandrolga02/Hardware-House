import { Router } from "express";
import {
	createProducts,
	deleteProducts,
	editProducts,
	renderProducts,
	updateProducts,
} from "../controllers/admin/productsControllers.js";
const router = Router();

// Administración Productos
router.get("/admin/productos/", renderProducts);
router.post("/admin/productos/add/", createProducts);
router.get("/admin/productos/update/:id", editProducts);
router.post("/admin/productos/update/:id", updateProducts);
router.get("/admin/productos/delete/:id", deleteProducts);

export default router;