import { pool } from "../db.js";

//Función para validar que la cadena no cuente con caracteres especiales
const validateString = (cadena) => {
	try {
		let regex = new RegExp(/^[A-Za-z0-9\s]+$/g);
		return regex.test(cadena);	//Retorna 'true' si no contiene caracteres especiales
	} catch (error) {
		console.log(error);
	}
}

export const renderClientIndex = async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT codigo, nombre, descripcion, precio, urlImagen FROM productos WHERE estado = 1 LIMIT 4");

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
				"/js/productos.js"
			]
		});
	} catch (error) {
		console.log(error);
	}
};

export const renderClientAboutUs = async (req, res) => {
	try {
		res.render("clients/empresa.html", {
			title: "Empresa",
			navLinks: [
				{ class: "nav-link", link: "/", title: "Inicio" },
				{ class: "nav-link active", link: "/empresa", title: "Empresa" },
				{ class: "nav-link", link: "/productos", title: "Productos" },
				{ class: "nav-link", link: "/contactos", title: "Contactos" },
			],
			scripts: [
				"/js/bootstrap.bundle.min.js",
			]
		});
	} catch (error) {
		console.log(error);
	}
};

export const renderClientProducts = async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT codigo, nombre, descripcion, precio, urlImagen FROM productos WHERE estado = 1");

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
				"/js/productos.js"
			]
		});
	} catch (error) {
		console.log(error);
	}
};

export const getProduct = async (req, res) => {
	try {
		let { codigo } = req.body;

		if (!validateString(codigo)) return res.status(400).send("Introduzca un articulo valido");

		const [producto] = await pool.query("SELECT codigo, nombre, precio, urlImagen, disponibilidad FROM productos WHERE estado = 1 AND codigo = ?", [codigo]);

		if (producto[0]) {
			return res.json(producto[0]);
		} else {
			return res.status(400).send("El producto no existe o está deshabilitado");
		}
	} catch (error) {
		console.log(error);
	}
};

export const renderClientContactUs = async (req, res) => {
	try {
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
			]
		});
	} catch (error) {
		console.log(error);
	}
};

export const postContactUs = async (req, res) => {
	try {
		res.render("admin/productos.html", {
			title: "Admin - Productos",
			products: rows,
			categorias,
			scripts: [
				"https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
				"/js/bootstrap.bundle.min.js",
			]
		});
	} catch (error) {
		console.log(error);
	}
};

export const renderNotFound = async (req, res) => {
	try {
		res.status(404).render("error.html", {
			title: "Pagina no encontrada",
			navLinks: [
				{ class: "nav-link active", link: "/", title: "Inicio" },
				{ class: "nav-link", link: "/empresa", title: "Empresa" },
				{ class: "nav-link", link: "/productos", title: "Productos" },
				{ class: "nav-link", link: "/contactos", title: "Contactos" },
			],
			scripts: [
				"/js/bootstrap.bundle.min.js"
			]
		});
	} catch (error) {
		console.log(error);
	}
}