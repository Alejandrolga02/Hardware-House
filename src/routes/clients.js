import { Router } from "express";
import {
	renderClientIndex,
	renderClientAboutUs,
	renderClientProducts,
	renderClientFAQ,
	getProduct,
	completePurchase,
	renderNotFound
} from "../controllers/clientsController.js";
import { isLogged, validarCliente, validarJWT } from "../jwt.js";

const router = Router();

// Administración Productos
router.get("/", isLogged, validarCliente, renderClientIndex);
router.get("/nosotros", isLogged, validarCliente, renderClientAboutUs);
router.get("/productos", isLogged, validarCliente, renderClientProducts);
router.post("/productos/get", validarJWT, validarCliente, getProduct);
router.get("/preguntas", isLogged, validarCliente, renderClientFAQ);
router.post("/buy", validarJWT, validarCliente, completePurchase);

router.use(isLogged, renderNotFound);

export default router;
