import { Router } from "express";
import { login, renderLogin, logout, register } from "../controllers/adminAuthController.js";
import { checkLogged, validarJWT } from "../jwt.js";

const router = Router();

// Autentificacion
router.get("/login", checkLogged, renderLogin);
router.post('/login', login);
router.get("/logout", logout);

// Crear usuarios
router.post("/register", register);

export default router;