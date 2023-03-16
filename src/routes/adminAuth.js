import { Router } from "express";
import { login, renderLogin, logout, register } from "../controllers/adminAuthController.js";
import session from '../session.js';

const router = Router();

// Autentificacion
router.get("/", (req, res, next) => {
	if (session.isAuth) {
		res.redirect("/admin/menu");
	} else {
		next();
	}
}, renderLogin);
router.post('/login', login);
router.get("/logout", logout);

// Crear usuarios
router.post("/register", session.checkAdmin, register);

export default router;