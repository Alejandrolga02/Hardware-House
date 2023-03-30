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
		const [rows] = await pool.query("SELECT codigo, nombre, descripcion, precio, urlImagen, idCategoria FROM productos WHERE estado = 1 LIMIT 4");
		if (!rows[0]) {
			return res.status(400).send("No existen productos disponibles");
		}

		for (const item of rows) {
			const [promociones] = await pool.query("SELECT porcentajeDescuento FROM promociones WHERE CURDATE() >= fechaInicio AND CURDATE() <= fechaFin AND idCategoria = ?", [item.idCategoria]);

			if (promociones[0]) {
				item.precioFinal = parseFloat(item.precio - (item.precio * (parseFloat(promociones[0].porcentajeDescuento) / 100)))
			} else {
				item.precioFinal = item.precio;
			}
		}

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
				"/js/carrito.js"
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
				"https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
				"/js/bootstrap.bundle.min.js",
				"/js/carrito.js"
			]
		});
	} catch (error) {
		console.log(error);
	}
};

export const renderClientProducts = async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT codigo, nombre, descripcion, precio, urlImagen, idCategoria FROM productos WHERE estado = 1");
		if (!rows[0]) {
			return res.status(400).send("No existen productos disponibles");
		}

		for (const item of rows) {
			const [promociones] = await pool.query("SELECT porcentajeDescuento FROM promociones WHERE CURDATE() >= fechaInicio AND CURDATE() <= fechaFin AND idCategoria = ?", [item.idCategoria]);

			if (promociones[0]) {
				item.precioFinal = parseFloat(item.precio - (item.precio * (parseFloat(promociones[0].porcentajeDescuento) / 100)))
			} else {
				item.precioFinal = item.precio;
			}
		}

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
				"/js/carrito.js"
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

		const [resultado] = await pool.query("SELECT codigo, nombre, precio, urlImagen, disponibilidad, idCategoria FROM productos WHERE estado = 1 AND codigo = ?", [codigo]);
		const [promociones] = await pool.query("SELECT porcentajeDescuento FROM promociones WHERE CURDATE() >= fechaInicio AND CURDATE() <= fechaFin AND idCategoria = ?", [resultado[0].idCategoria]);

		if (resultado[0]) {
			let producto = {
				codigo: resultado[0].codigo,
				nombre: resultado[0].nombre,
				precio: parseFloat(resultado[0].precio),
				urlImagen: resultado[0].urlImagen,
				disponibilidad: parseInt(resultado[0].disponibilidad),
			}

			if (promociones[0]) {
				producto.precioFinal = parseFloat(producto.precio - (producto.precio * (parseFloat(promociones[0].porcentajeDescuento) / 100)));
			} else {
				producto.precioFinal = producto.precio;
			}

			return res.json(producto);
		} else {
			return res.status(400).send("El producto no existe o está deshabilitado");
		}
	} catch (error) {
		console.log(error);
		return res.status(400).send("El producto no existe o está deshabilitado");
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
				"/js/carrito.js"
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
				"/js/carrito.js"
			]
		});
	} catch (error) {
		console.log(error);
	}
};

export const completePurchase = async (req, res) => {
	try {
		let { productsList, idUsuario, tipoPago } = req.body;

		let total = 0;

		for (const product of productsList) {
			let [[result]] = await pool.query("SELECT * FROM productos WHERE codigo = ?", product.codigo);
			console.log(result);
			if (product.cantidad > result.disponibilidad) {
				return res.status(400).send("El producto que intentas comprar no cuenta con el stock suficiente");
			}

			const [[promociones]] = await pool.query("SELECT porcentajeDescuento FROM promociones WHERE CURDATE() >= fechaInicio AND CURDATE() <= fechaFin AND idCategoria = ?", [product.idCategoria]);

			if (promociones) {
				product.precioFinal = parseFloat(product.precio - (product.precio * (parseFloat(promociones.porcentajeDescuento) / 100)))
			} else {
				product.precioFinal = product.precio;
			}

			let newVenta = {
				idVenta: 0,
				idProducto: product.codigo,
				cantidad: product.cantidad,
			}

			await pool.query("INSERT INTO ventas_detalle set ?", [newVenta]);	//Se realiza la inserción.

			total += product.precioFinal;
		}

		const newPurchase = {
			id: 0,
			idVendedor: 1,
			idComprador: 1,
			total
		}

		const rows = await pool.query("INSERT INTO ventas set fecha = CURRENT_TIMESTAMP() AND ?", [newPurchase]);	//Se realiza la inserción.

		res.render("admin/productos.html", {
			title: "Admin - Productos",
			products: rows,
			categorias,
			scripts: [
				"https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
				"/js/bootstrap.bundle.min.js",
				"/js/carrito.js"
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
				"https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
				"/js/bootstrap.bundle.min.js",
				"/js/carrito.js"
			]
		});
	} catch (error) {
		console.log(error);
	}
}