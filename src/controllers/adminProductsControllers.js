import { pool } from "../db.js";
import cloudinary from '../cloudinary.js';
import fs from "fs";

//Función para mostrar todos los productos.
export const renderProducts = async (req, res) => {
	const [rows] = await pool.query("SELECT productos.codigo, productos.nombre, productos.descripcion, productos.precio, productos.urlImagen, productos.disponibilidad, productos.idCategoria, productos.estado, categorias.nombre AS categoria FROM productos LEFT JOIN categorias ON productos.idCategoria = categorias.id");
	const [categorias] = await pool.query("SELECT * FROM categorias");
	res.render("admin/productos.html", {
		title: "Admin - Productos",
		products: rows,
		categorias,
		navLinks: [
			{ class: "nav-link", link: "/", title: "Inicio" },
			{ class: "nav-link active", link: "/admin/productos/", title: "Productos" },
			{ class: "nav-link", link: "/admin/ventas/", title: "Ventas" },
			{ class: "nav-link", link: "/admin/categorias/", title: "Categorias" },
			{ class: "nav-link", link: "/admin/promociones/", title: "Promociones" },
		],
		scripts: [
			"https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
			"/js/bootstrap.bundle.min.js",
			//"/js/admin-productos.js"
		]
	});
};

//Función para crear un nuevo producto.
export const createProducts = async (req, res) => {
	try {
		if(req.files === null){		//Comprobación de subida de archivo.
			res.redirect("/admin/productos");
			return;
		}

		console.log(req.files.urlImagen);

		if(req.files.urlImagen.truncated) {
			res.redirect("/admin/productos");
			return;
		}

		const photo = req.files.urlImagen;	//Se obtiene el objeto del archivo
		const result = await cloudinary.uploader.upload(photo.tempFilePath, {	//Se ssube la imagen a Cloudinary
			folder: "products",
		});

		const url = `${result.public_id}.${result.format}`;	//Se obtienenla URL de la imagen en Cloudinary

		//Función para eliminar las imagenes temporales.
		try {
			fs.unlinkSync(photo.tempFilePath);
			console.log("Archivo removido");
		} catch (err) {
			console.error("Error ", err);
		}

		const newProduct = {	//Creación del objeto usado para realizar la inserción
			codigo: req.body.codigo,
			nombre: req.body.nombre,
			descripcion: req.body.descripcion,
			precio: parseFloat(req.body.precio),
			urlImagen: url,
			estado: 1,
			disponibilidad: parseInt(req.body.disponibilidad),
			idCategoria: parseInt(req.body.idCategoria)
		}

		console.log(newProduct);
		//const rows = await pool.query("INSERT INTO productos set ?", [newProduct]);	//Se realiza la inserción.
		res.redirect("/admin/productos");	//Se redirecciona a la pagina de productos
		return;

	} catch (error) {
		console.log(error)
	}
};

//Función para traer la información del producto selecciónado.
export const editProducts = async (req, res) => {
	const { id } = req.params;	//obtención del id
	const [result] = await pool.query("SELECT * FROM productos WHERE codigo = ?", [id,]);	//Solicitud para la obtencion de datos.
	res.render("admin/productos.html", {
		title: "Editar Producto",
		product: result[0]
	});
};

//Función para actualizar los datos necesarios.
export const updateProducts = async (req, res) => {
	const { id } = req.params;
	const newProduct = {
		codigo: req.body.codigo,
		nombre: req.body.nombre,
		descripcion: req.body.descripcion,
		precio: parseFloat(req.body.precio),
		urlImagen: url,
		estado: req.body.estado,
		disponibilidad: parseInt(req.body.disponibilidad),
		idCategoria: parseInt(req.body.idCategoria)
	}
	await pool.query("UPDATE productos set ? WHERE codigo = ?", [newCustomer, id]);
	res.redirect("/admin/productos");
};

//Función para desactivar los productos.
export const deleteProducts = async (req, res) => {
	const { id } = req.params;
	const [rows] = await pool.query("SELECT estado FROM productos WHERE codigo = ?", [id]);
	const estado = rows[0].estado;	//obtención del estado.

	if (estado == 1) {	//Se realiza el cambio del estado.
		const result = await pool.query("UPDATE productos set estado = ? WHERE codigo = ?", [0, id]);
		console.log("SE DESACTIVO")
	} else {
		const result = await pool.query("UPDATE productos set estado = ? WHERE codigo = ?", [1, id]);
		console.log("SE ACTIVO");
	}
	res.redirect("/admin/productos");
};
