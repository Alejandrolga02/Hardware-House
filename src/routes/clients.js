import { Router } from "express";
import { renderClientIndex, renderClientAboutUs, renderClientProducts, renderClientContactUs, postContactUs } from "../controllers/clientsController.js";

const router = Router();

// Administración Productos
router.get("/", renderClientIndex);
router.get("/empresa", renderClientAboutUs);
router.get("/productos", renderClientProducts);
router.get("/contactos", renderClientContactUs);
router.post("/contactos", postContactUs);

router.use((req, res, next) => {
	res.status(404).render("error.html", {
		title: "Pagina no encontrada",
		navLinks: [
			{ class: "nav-link", link: "/", title: "Inicio" },
		],
		scripts: [
			"js"
		]
	});
});

export default router;
