import { Router } from "express";
import { login, renderLogin, logout, register } from "../controllers/adminAuthController.js";
import session from '../session.js';
import { checkLogged, validarJWT } from "../jwt.js";

const router = Router();

// Autentificacion
router.get("/login", checkLogged, renderLogin);
router.post('/login', login);
router.get("/logout", validarJWT, logout);

// Crear usuarios
router.post("/register", session.checkAdmin, register);

export default router;