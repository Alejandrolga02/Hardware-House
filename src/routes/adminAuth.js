import { Router } from "express";
import { login, renderLogin, logout } from "../controllers/adminAuthController.js";

const router = Router();

// Autentificacion
router.get("/", renderLogin);
router.post('/login', login);
router.get("/logout", logout);
// router.post("/add/", createProducts);
// router.get("/update/:id", editProducts);
// router.post("/update/:id", updateProducts);
// router.get("/delete/:id", deleteProducts);

export default router;