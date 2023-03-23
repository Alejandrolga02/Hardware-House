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
import session from '../session.js'

const router = Router();

// Administración Productos
router.get("/", session.checkAdmin, renderProducts);
router.post("/search", session.checkAdmin, searchProducts);
router.post("/add", session.checkAdmin, fileUpload({
	useTempFiles: true,
	limits: { fileSize: 2 * 1024 * 1024 }	//Se tiene un limite de 2mb por archivo
}), createProducts);
router.get("/update/:id", session.checkAdmin, editProducts);
router.post("/update/:id", session.checkAdmin, fileUpload({
	useTempFiles: true,
	limits: { fileSize: 2 * 1024 * 1024 }	//Se tiene un limite de 2mb por archivo
}),updateProducts);
router.get("/delete/:id", session.checkAdmin, deleteProducts);

export default router;