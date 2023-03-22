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
			"/js/admin-productos.js"
		]
	});
};

const deleteTempImage = (filePath) => {
	// Función para eliminar las imagenes temporales.
	try {
		fs.unlinkSync(filePath);
		console.log("Archivo removido");
	} catch (err) {
		console.error("Error ", err);
	}
}

//Función para validar que la cadena no cuente con caracteres especiales
const validateString = (cadena) =>{
	let regex = /^[a-zA-Z0-9]+$/;
	return !(regex.test(cadena));	//Retorna 'true' si no contiene caracteres especiales
}

//Función para validar. Recibe el objeto
const validateData = (product) =>{
	if(!validateString(product.codigo) || (product.codigo == " ")){	//Convierte e false en 'true'
		return false;
	}
	
	if(!validateString(product.nombre) || (product.nombre == " ")){
		return false;
	}

	if(!validateString(product.descripcion) || (product.descripcion == " ")){
		return false;
	}

	if(isNaN(product.precio) || (parseFloat(product.precio) <= 0)){
		return false;
	}

	if(isNaN(product.disponibilidad) || (parseInt(product.disponibilidad) <= 0)){
		return false;
	}

	if(isNaN(product.idCategoria) || (parseInt(product.idCategoria) <= 0)){
		return false;
	}

	if(product.url === undefined){
		return false;
	}
}

//Función para comprobar existencia del mismo codigo.
const findSameCode = async (codigo) =>{
	const [rows] = await pool.query("SELECT estado FROM productos WHERE codigo = ?", [codigo]);
	const cod = rows[0];	//obtención del estado.
}

//Función para la validación del formato de la imagen
const validationFormatImage = (photo) =>{

}

//Función para crear un nuevo producto.
export const createProducts = async (req, res) => {
	try {
		if (req.files === null) {	// Comprobación de subida de archivo.
			return res.status(400).send("No se subió una imagen");
		}

		console.log(req.files.urlImagen);
		const photo = req.files.urlImagen;	// Se obtiene el objeto del archivo

		const newProduct = {	// Creación del objeto usado para realizar la inserción
			codigo: req.body.codigo,
			nombre: req.body.nombre,
			descripcion: req.body.descripcion,
			precio: req.body.precio,
			urlImagen: photo,
			estado: 1,
			disponibilidad: req.body.disponibilidad,
			idCategoria: req.body.idCategoria
		}

		if (!validateData(newProduct)) {	// Validar que los datos sean del tipo deseado pasando la función
			deleteTempImage(photo.tempFilePath);

			return res.status(400).send("Los datos no son del tipo correcto");
		}

		if (!findSameCode(newProduct.codigo)) {	// Validar que no exista un registro con ese código
			deleteTempImage(photo.tempFilePath);

			return res.status(400).send("Existe un registro con ese código");
		}

		if (!validationFormatImage(photo)) {	// Validar que la imagen sea de las extensiones deseadas
			deleteTempImage(photo.tempFilePath);

			return res.status(400).send("La imagen debe ser de las extensiones deseadas");
		}

		if (photo.truncated) {	// Archivo excede el tamaño limite
			deleteTempImage(photo.tempFilePath);

			return res.status(400).send("La imagen excede el tamaño limite");
		}

		const result = await cloudinary.uploader.upload(photo.tempFilePath, {	// Se sube la imagen a Cloudinary
			folder: "products",
		});

		const url = `${result.public_id}.${result.format}`;	// Se obtienenla URL de la imagen en Cloudinary

		deleteTempImage(photo.tempFilePath);

		console.log(newProduct);

		//const rows = await pool.query("INSERT INTO productos set ?", [newProduct]);	//Se realiza la inserción.

		return res.status(200).send("Se insertaron con exito los datos");

	} catch (error) {
		console.log(error.message);
		return res.status(400).send("Sucedio un error");
	}
};

//Función para traer la información del producto selecciónado.
export const editProducts = async (req, res) => {
	const { id } = req.params;	//obtención del id
	const [result] = await pool.query("SELECT * FROM productos WHERE codigo = ?", [id]);	//Solicitud para la obtencion de datos.
	const [categorias] = await pool.query("SELECT * FROM categorias");
	res.render("admin/editProduct.html", {
		title: "Editar Producto",
		product: result[0],
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
			"/js/admin-edit-product.js"
		]
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
