import { Router } from "express";
import {
	createProducts,
	deleteProducts,
	editProducts,
	renderProducts,
	updateProducts,
	searchProducts
} from "../controllers/adminProductsControllers.js";
import fileUpload from "express-fileupload";
import { validarAdmin, validarJWT } from "../jwt.js";

const router = Router();

// Administración Productos
router.get("/", validarJWT, validarAdmin, renderProducts);
router.post("/", validarJWT, validarAdmin, searchProducts);
router.post("/add", validarJWT, validarAdmin, fileUpload({
	useTempFiles: true,
	limits: { fileSize: 2 * 1024 * 1024 }	//Se tiene un limite de 2mb por archivo
}), createProducts);
router.get("/update/:id", validarJWT, validarAdmin, editProducts);
router.post("/update/:id", fileUpload({
	useTempFiles: true,
	limits: { fileSize: 2 * 1024 * 1024 }	//Se tiene un limite de 2mb por archivo
}), updateProducts);
router.get("/delete/:id", validarJWT, validarAdmin, deleteProducts);

export default router;