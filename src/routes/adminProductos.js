import { Router } from "express";
import {
	createProducts,
	deleteProducts,
	editProducts,
	renderProducts,
	updateProducts,
	searchProducts,
	parametrosImagen
} from "../controllers/adminProductsControllers.js";
import {
	validarAdmin,
	validarJWT
} from "../jwt.js";

const router = Router();

// Administración Productos
router.get("/", validarJWT, validarAdmin, renderProducts);
router.post("/", validarJWT, validarAdmin, searchProducts);
router.post("/add", validarJWT, validarAdmin, parametrosImagen, createProducts);
router.get("/update/:id", validarJWT, validarAdmin, editProducts);
router.post("/update/:id", validarJWT, validarAdmin, parametrosImagen, updateProducts);
router.get("/delete/:id", validarJWT, validarAdmin, deleteProducts);

export default router;