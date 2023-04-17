import { escape } from "mysql2";
import { pool } from "../db.js";

//Función para validar que la cadena no cuente con caracteres especiales
const validateString = (cadena) => {
	try {
		let regex = new RegExp(/^[A-Za-z0-9-áéíóúÁÉÍÓÚ\s]+$/g);
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
				item.precioFinal = parseFloat(item.precio - (item.precio * ((parseFloat(promociones[0].porcentajeDescuento) + parseFloat(req.user.descuento)) / 100)))
			} else {
				item.precioFinal = parseFloat(item.precio - (item.precio * (parseFloat(req.user.descuento) / 100)));
			}
		}

		res.render("clients/index.html", {
			title: "Inicio",
			products: rows,
			navLinks: [
				{ class: "nav-link active", link: "/", title: "Inicio" },
				{ class: "nav-link active", link: "/nosotros", title: "Nosotros" },
				{ class: "nav-link", link: "/productos", title: "Productos" },
				{ class: "nav-link", link: "/contactos", title: "Contactos" },
			],
			scripts: [
				"/js/carrito.js"
			],
			isLogged: req.user.isLogged
		});
	} catch (error) {
		console.log(error);
	}
};

export const renderClientAboutUs = async (req, res) => {
	try {
		res.render("clients/nosotros.html", {
			title: "Nosotros",
			navLinks: [
				{ class: "nav-link", link: "/", title: "Inicio" },
				{ class: "nav-link active", link: "/nosotros", title: "Nosotros" },
				{ class: "nav-link", link: "/productos", title: "Productos" },
				{ class: "nav-link", link: "/contactos", title: "Contactos" },
			],
			scripts: [
				"/js/carrito.js"
			],
			isLogged: req.user.isLogged
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
				item.precioFinal = parseFloat(item.precio - (item.precio * ((parseFloat(promociones[0].porcentajeDescuento) + parseFloat(req.user.descuento)) / 100)))
			} else {
				item.precioFinal = parseFloat(item.precio - (item.precio * (parseFloat(req.user.descuento) / 100)));
			}
		}

		res.render("clients/productos.html", {
			title: "Productos",
			products: rows,
			navLinks: [
				{ class: "nav-link", link: "/", title: "Inicio" },
				{ class: "nav-link active", link: "/nosotros", title: "Nosotros" },
				{ class: "nav-link active", link: "/productos", title: "Productos" },
				{ class: "nav-link", link: "/contactos", title: "Contactos" },
			],
			scripts: [
				"/js/carrito.js"
			],
			isLogged: req.user.isLogged
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

		if (!resultado[0]) {
			return res.status(400).send("El producto no existe o está deshabilitado");
		}

		let producto = {
			codigo: resultado[0].codigo,
			nombre: resultado[0].nombre,
			precio: parseFloat(resultado[0].precio),
			urlImagen: resultado[0].urlImagen,
			disponibilidad: parseInt(resultado[0].disponibilidad),
		}

		if (promociones[0]) {
			producto.precioFinal = parseFloat(producto.precio - (producto.precio * ((parseFloat(promociones[0].porcentajeDescuento) + parseFloat(req.user.descuento)) / 100)));
		} else {
			producto.precioFinal = parseFloat(producto.precio - (producto.precio * (parseFloat(req.user.descuento) / 100)));
		}

		return res.json(producto);
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
				{ class: "nav-link active", link: "/nosotros", title: "Nosotros" },
				{ class: "nav-link", link: "/productos", title: "Productos" },
				{ class: "nav-link active", link: "/contactos", title: "Contactos" },
			],
			scripts: [
				"/js/carrito.js"
			],
			isLogged: req.user.isLogged
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
				"/js/carrito.js"
			]
		});
	} catch (error) {
		console.log(error);
	}
};

export const completePurchase = async (req, res) => {
	try {
		// Obtencion de datos
		let { productsList, tipoPago } = req.body;
		let { id, descuento } = req.user;

		try {
			// Conversion de string obtenido a array
			productsList = JSON.parse(productsList);
		} catch (error) {
			return res.status(400).send("Tu carrito de compras es invalido");
		}

		const idUsuario = Number.parseInt(id);

		let total = 0;

		// Se envió algo que no es un carrito
		if (typeof productsList !== "object") {
			return res.status(400).send("Tu carrito de compras es invalido");
		}

		// Carrito vacio
		if (productsList.length <= 0) {
			return res.status(400).send("Tu carrito de compras está vacio");
		}

		// idUsuario
		if (typeof idUsuario !== "number" || idUsuario < 0 || isNaN(idUsuario)) {
			return res.status(400).send("Tu usuario es invalido");
		}

		// Tipo valido valido
		if (typeof tipoPago !== "string") {
			return res.status(400).send("Tu método de pago es invalido");
		}

		if (tipoPago !== "Transferencia" && tipoPago !== "Débito" && tipoPago !== "Crédito") {
			return res.status(400).send("Tu método de pago es invalido");
		}

		let ventasDetalle = "INSERT INTO ventas_detalle(idVenta, idProducto, cantidad) VALUES "
		for (const product of productsList) {
			// Consulta para obtener informacion del producto
			let [[result]] = await pool.query("SELECT * FROM productos WHERE codigo = ?", [product.codigo]);

			// Validacion que el producto exista
			if (result === undefined || result === null) {
				return res.status(400).send("Un producto que intentas comprar no existe");
			}

			// Validar cantidad de producto
			if (product.cantidad <= 0) {
				return res.status(400).send("Un producto que intentas comprar no cuenta con stock");
			}

			// Validacion de stock
			if (product.cantidad > result.disponibilidad) {
				return res.status(400).send("Un producto que intentas comprar no cuenta con el stock suficiente");
			}

			const [[promociones]] = await pool.query("SELECT porcentajeDescuento FROM promociones WHERE CURDATE() >= fechaInicio AND CURDATE() <= fechaFin AND idCategoria = ?", [result.idCategoria]);

			if (promociones) {
				product.precioFinal = parseFloat(result.precio - (result.precio * ((parseFloat(promociones.porcentajeDescuento) + parseFloat(descuento)) / 100)));
			} else {
				product.precioFinal = parseFloat(result.precio - (result.precio * (parseFloat(descuento) / 100)));
			}

			ventasDetalle += `(LAST_INSERT_ID(), ${escape(product.codigo)}, ${escape(product.cantidad)}),`;
			total += parseFloat(product.precioFinal * product.cantidad);
		}

		await pool.query("START TRANSACTION");

		await pool.query("INSERT INTO ventas set fecha = CURRENT_TIMESTAMP, ?", [{
			total,
			idUsuario,
			tipoPago
		}]);	//Se realiza la inserción.

		// Elimina coma final de venta detalle
		ventasDetalle = ventasDetalle.slice(0, -1);
		await pool.query(ventasDetalle);
		await pool.query("COMMIT");

		return res.status(200).send("Venta realizada con exito");

	} catch (error) {
		console.log(error);
		await pool.query("ROLLBACK");
		return res.status(400).send("Sucedio un error con el servidor");
	}
};

export const renderNotFound = async (req, res) => {
	try {
		res.status(404).render("error.html", {
			title: "Pagina no encontrada",
			navLinks: [
				{ class: "nav-link active", link: "/", title: "Inicio" },
				{ class: "nav-link active", link: "/nosotros", title: "Nosotros" },
				{ class: "nav-link", link: "/productos", title: "Productos" },
				{ class: "nav-link", link: "/contactos", title: "Contactos" },
			],
			scripts: [
				"/js/carrito.js"
			],
			isLogged: req.user.isLogged
		});
	} catch (error) {
		console.log(error);
	}
}