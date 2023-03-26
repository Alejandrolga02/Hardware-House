import { Router } from "express";
import {
	renderClientIndex,
	renderClientAboutUs,
	renderClientProducts,
	renderClientContactUs,
	postContactUs,
	getProduct,
	renderNotFound
} from "../controllers/clientsController.js";

const router = Router();

// Administración Productos
router.get("/", renderClientIndex);
router.get("/empresa", renderClientAboutUs);
router.get("/productos", renderClientProducts);
router.post("/productos/get", getProduct);
router.get("/contactos", renderClientContactUs);
router.post("/contactos", postContactUs);

router.use(renderNotFound);

export default router;
