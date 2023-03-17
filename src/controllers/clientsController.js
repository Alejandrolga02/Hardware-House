import { pool } from "../db.js";

export const renderClientIndex = async (req, res) => {
	const [rows] = await pool.query("SELECT codigo, nombre, descripcion, precio, urlImagen FROM productos WHERE estado = 0 LIMIT 4");
	res.render("clients/index.html", {
		title: "Home",
		products: rows,
		navLinks: [
			{ class: "nav-link active", link: "/", title: "Inicio" },
			{ class: "nav-link", link: "/empresa", title: "Empresa" },
			{ class: "nav-link", link: "/productos", title: "Productos" },
			{ class: "nav-link", link: "/contactos", title: "Contactos" },
		],
		scripts: [
			"https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
			"/js/bootstrap.bundle.min.js",
			//"/js/admin-productos.js"
		]
	});
};

export const renderClientAboutUs = async (req, res) => {
	res.render("clients/empresa.html", {
		title: "Empresa",
		navLinks: [
			{ class: "nav-link", link: "/", title: "Inicio" },
			{ class: "nav-link active", link: "/empresa", title: "Empresa" },
			{ class: "nav-link", link: "/productos", title: "Productos" },
			{ class: "nav-link", link: "/contactos", title: "Contactos" },
		],
		scripts: [
			"https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
			"/js/bootstrap.bundle.min.js",
			//"/js/admin-productos.js"
		]
	});
};

export const renderClientProducts = async (req, res) => {
	const [rows] = await pool.query("SELECT codigo, nombre, descripcion, precio, urlImagen FROM productos WHERE estado = 0");

	res.render("clients/productos.html", {
		title: "Productos",
		products: rows,
		navLinks: [
			{ class: "nav-link", link: "/", title: "Inicio" },
			{ class: "nav-link", link: "/empresa", title: "Empresa" },
			{ class: "nav-link active", link: "/productos", title: "Productos" },
			{ class: "nav-link", link: "/contactos", title: "Contactos" },
		],
		scripts: [
			"https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
			"/js/bootstrap.bundle.min.js",
			//"/js/admin-productos.js"
		]
	});
};

export const renderClientContactUs = async (req, res) => {
	res.render("clients/contactos.html", {
		title: "Contactos",
		navLinks: [
			{ class: "nav-link", link: "/", title: "Inicio" },
			{ class: "nav-link", link: "/empresa", title: "Empresa" },
			{ class: "nav-link", link: "/productos", title: "Productos" },
			{ class: "nav-link active", link: "/contactos", title: "Contactos" },
		],
		scripts: [
			"https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
			"/js/bootstrap.bundle.min.js",
			//"/js/admin-productos.js"
		]
	});
};

export const postContactUs = async (req, res) => {
	res.render("admin/productos.html", {
		title: "Admin - Productos",
		products: rows,
		categorias,
		scripts: [
			"https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
			"/js/bootstrap.bundle.min.js",
			//"/js/admin-productos.js"
		]
	});
};