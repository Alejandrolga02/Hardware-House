import { Router } from "express";
import {
	createProducts,
	deleteProducts,
	editProducts,
	renderProducts,
	updateProducts,
} from "../controllers/adminProductsControllers.js";

const router = Router();

// Administración Productos
router.get("/", renderProducts);
router.post("/add/", createProducts);
router.get("/update/:id", editProducts);
router.post("/update/:id", updateProducts);
router.get("/delete/:id", deleteProducts);

export default router;