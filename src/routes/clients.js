import { Router } from "express";
import {
	renderClientIndex,
	renderClientAboutUs,
	renderClientProducts,
	renderClientContactUs,
	postContactUs,
	getProduct,
	completePurchase,
	renderNotFound
} from "../controllers/clientsController.js";
import { isLogged, validarCliente, validarJWT } from "../jwt.js";

const router = Router();

// Administración Productos
router.get("/", isLogged, validarCliente, renderClientIndex);
router.get("/empresa", isLogged, validarCliente, renderClientAboutUs);
router.get("/productos", isLogged, validarCliente, renderClientProducts);
router.post("/productos/get", validarJWT, validarCliente, getProduct);
router.get("/contactos", isLogged, validarCliente, renderClientContactUs);
router.post("/contactos", isLogged, validarCliente, postContactUs);
router.post("/buy", validarJWT, validarCliente, completePurchase);

router.use(isLogged, renderNotFound);

export default router;
