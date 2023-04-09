import { Router } from "express";
import { login, renderLogin, logout, register, renderRegister } from "../controllers/adminAuthController.js";
import { checkLogged, validarJWT } from "../jwt.js";

const router = Router();

// Autentificacion
router.get("/login", checkLogged, renderLogin);
router.post('/login', login);
router.get("/logout", validarJWT, logout);

// Crear usuarios
router.get("/register", checkLogged, renderRegister);
router.post("/register", register);

export default router;