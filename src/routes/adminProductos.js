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

const router = Router();

// Administración Productos
router.get("/", renderProducts);
router.post("/", searchProducts);
router.post("/add", fileUpload({
	useTempFiles: true,
	limits: { fileSize: 2 * 1024 * 1024 }	//Se tiene un limite de 2mb por archivo
}), createProducts);
router.get("/update/:id", editProducts);
router.post("/update/:id", fileUpload({
	useTempFiles: true,
	limits: { fileSize: 2 * 1024 * 1024 }	//Se tiene un limite de 2mb por archivo
}), updateProducts);
router.get("/delete/:id", deleteProducts);

export default router;