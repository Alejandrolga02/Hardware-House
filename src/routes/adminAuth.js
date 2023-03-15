import { Router } from "express";
import { login } from "../controllers/adminAuthController.js";


const router = Router();

// Autentificacion
router.post('/login', login);
router.get("/", (req, res) => {
	res.render("admin/login.html", {
		title: "Admin - Login",
		scripts: [
			"/js/bootstrap.bundle.min.js",
		]
	});
});
// router.post("/add/", createProducts);
// router.get("/update/:id", editProducts);
// router.post("/update/:id", updateProducts);
// router.get("/delete/:id", deleteProducts);

export default router;