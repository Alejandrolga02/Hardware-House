import { pool } from "../db.js";
import cloudinary from '../cloudinary.js';
import fs from "fs";
import { escape } from 'mysql2';
import fileUpload from "express-fileupload";
let query = "SELECT productos.codigo, productos.nombre, productos.descripcion, productos.precio, productos.urlImagen, productos.estado, productos.disponibilidad, categorias.nombre AS categoria FROM productos LEFT JOIN categorias ON productos.idCategoria = categorias.id";
let form = {};

//Función para mostrar todos los productos.
export const renderProducts = async (req, res) => {
	try {
		form.counter -= 1;
		if (form.counter === 0) {
			form = {};
			query = "SELECT productos.codigo, productos.nombre, productos.descripcion, productos.precio, productos.urlImagen, productos.estado, productos.disponibilidad, categorias.nombre AS categoria FROM productos LEFT JOIN categorias ON productos.idCategoria = categorias.id";
		}

		const [products] = await pool.query(query);
		const [categorias] = await pool.query("SELECT * FROM categorias");

		res.render("admin/productos.html", {
			title: "Admin - Productos",
			products,
			categorias,
			form,
			navLinks: [
				{ class: "nav-link", link: "/", title: "Inicio" },
				{ class: "nav-link active", link: "/admin/productos/", title: "Productos" },
				{ class: "nav-link", link: "/admin/ventas/", title: "Ventas" },
				{ class: "nav-link", link: "/admin/categorias/", title: "Categorias" },
				{ class: "nav-link", link: "/admin/promociones/", title: "Promociones" },
			],
			scripts: [
				"/js/admin-productos.js"
			],
			isLogged: req.user.isLogged
		});
	} catch (error) {
		console.log(error);
	}
};

function filterSearchProduct(obj) {
	const result = {};
	// Expresión regular que extrae el contenido entre corchetes
	const regex = /\[(.*?)\]/;
	for (const key in obj) {
		if (key.startsWith('searchProduct')) {
			const match = key.match(regex); // buscamos el contenido entre corchetes
			if (match) {
				result[match[1]] = obj[key]; // agregamos la propiedad al objeto resultado
			}
		}
	}
	return result;
}

// Función para buscar productos
export const searchProducts = async (req, res) => {
	try {
		let body = req.body;
		console.log(body);
		let searchProduct = filterSearchProduct(body);

		if (Object.keys(searchProduct).length === 0) {
			return res.status(400).send("Añade contenido a la consulta");
		}

		query = "SELECT productos.codigo, productos.nombre, productos.descripcion, productos.precio, productos.urlImagen, productos.estado, productos.disponibilidad, categorias.nombre AS categoria FROM productos LEFT JOIN categorias ON productos.idCategoria = categorias.id WHERE ";

		let i = 0;
		for (const [key, value] of Object.entries(searchProduct)) {
			if (i === Object.keys(searchProduct).length - 1) {
				query += `productos.${key} LIKE ${escape("%" + value + "%")}`;
			} else {
				query += `productos.${key} LIKE ${escape("%" + value + "%")} AND `;
			}

			form[key] = value;
			i++;
		}
		form.counter = 2;
		return res.status(200).send("Query creado exitosamente");
	} catch (error) {
		console.log(error);
	}
};

const deleteTempImage = (filePath) => {
	// Función para eliminar las imagenes temporales.
	try {
		fs.unlinkSync(filePath);
	} catch (err) {
		console.error("Error ", err);
	}
}

//Función para validar que la cadena no cuente con caracteres especiales
const validateString = (cadena) => {
	try {
		let regex = new RegExp(/^[A-Za-z0-9-áéíóúÁÉÍÓÚ\s]+$/g);
		return regex.test(cadena);	//Retorna 'true' si no contiene caracteres especiales
	} catch (error) {
		console.log(error);
	}
}

//Función para validar. Recibe el objeto
const validateData = (product) => {
	try {
		if (!validateString(product.codigo) || (product.codigo == " ") || product.codigo.length > 20) {	//Convierte en false en 'true'
			return true;
		}

		if (!validateString(product.nombre) || (product.nombre == " ") || product.nombre.length > 60) {
			return true;
		}

		if (product.descripcion === "" || typeof product.descripcion !== "string" || product.descripcion.length > 200) {
			return true;
		}

		if (isNaN(product.precio) || product.precio <= 0 || product.precio > 99999999.99) {
			return true;
		}

		if (isNaN(product.disponibilidad) || product.disponibilidad < 0 || product.disponibilidad > 100000000) {
			return true;
		}

		if (isNaN(product.idCategoria) || product.idCategoria <= 0 || product.idCategoria > 100000000) {
			return true;
		}

		if (isNaN(product.estado) || product.estado < 0 || product.estado > 1) {
			return true;
		}
	} catch (error) {
		console.log(error);
	} finally {
		return false;
	}
}

//Función para validar la existencia del mismo codigo
const validateCode = async (codigo) => {
	try {
		const [[productos]] = await pool.query("SELECT productos.codigo FROM productos WHERE codigo = ?", [codigo]);

		return productos !== undefined;
	} catch (error) {
		console.log(error);
	}
}

//Función para la validación del formato de la imagen
const validationFormatImage = (photo) => {
	try {
		const extension = photo.mimetype.split('/')[1];	//Extrae la extensión.
		const exteValid = ['png', 'jpg'];

		if (!exteValid.includes(extension)) {
			return true;
		}

		return false;
	} catch (error) {
		console.log(error);
	}
}

//Función para crear un nuevo producto.
export const createProducts = async (req, res) => {
	try {
		if (req.files === null) {	// Comprobación de subida de archivo.
			return res.status(400).send("No se subió una imagen");
		}

		const photo = req.files.urlImagen;	// Se obtiene el objeto del archivo
		const newProduct = {	// Creación del objeto usado para realizar la inserción
			codigo: req.body.codigo,
			nombre: req.body.nombre,
			descripcion: req.body.descripcion,
			precio: parseFloat(req.body.precio),
			urlImagen: photo,
			estado: 1,
			disponibilidad: parseInt(req.body.disponibilidad),
			idCategoria: parseInt(req.body.idCategoria)
		}

		if (newProduct.disponibilidad == 0) {
			newProduct.estado = 0;
		}

		const resData = validateData(newProduct);

		if (resData) {	// Validar que los datos sean del tipo deseado pasando la función
			deleteTempImage(photo.tempFilePath);
			return res.status(400).send("Los datos no son del tipo correcto");
		}

		const resFun = await validateCode(newProduct.codigo);

		if (resFun) {	// Validar que no exista un registro con ese código
			deleteTempImage(photo.tempFilePath);
			return res.status(400).send("Existe un registro con ese código");
		}

		if (validationFormatImage(photo)) {	// Validar que la imagen sea de las extensiones deseadas
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

		newProduct.urlImagen = `${result.public_id}.${result.format}`;	// Se obtienenla URL de la imagen en Cloudinary
		deleteTempImage(photo.tempFilePath);
		const rows = await pool.query("INSERT INTO productos set ?", [newProduct]);	//Se realiza la inserción.
		console.log()
		return res.status(200).send("Se insertaron con exito los datos");
	} catch (error) {
		console.log(error.message);
		return res.status(400).send("Sucedio un error");
	}
};

//Función para traer la información del producto selecciónado.
export const editProducts = async (req, res) => {
	try {
		const { id } = req.params;	//obtención del id
		const [result] = await pool.query("SELECT * FROM productos WHERE codigo = ?", [id]);	//Solicitud para la obtencion de datos.
		const [categorias] = await pool.query("SELECT * FROM categorias");

		if (result.length === 0) {
			return res.redirect("/admin/productos/");
		}

		if (categorias.length === 0) {
			return res.redirect("/admin/categorias/");
		}

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
				"/js/admin-edit-product.js"
			],
			isLogged: req.user.isLogged
		});
	} catch (error) {
		console.log(error);
	}
};

//Función para actualizar los datos necesarios.
export const updateProducts = async (req, res) => {
	try {
		const { id } = req.params;

		let codigo = req.body.codigo;
		if (id != codigo) {
			res.status(400).send("No alterar los códigos");
		}

		if (!validateCode(id)) {
			res.status(400).send("No existe ese registro a modificar");
		}

		const newProduct = {
			codigo,
			nombre: req.body.nombre,
			descripcion: req.body.descripcion,
			precio: parseFloat(req.body.precio),
			estado: parseInt(req.body.estado),
			disponibilidad: parseInt(req.body.disponibilidad),
			idCategoria: parseInt(req.body.idCategoria)
		}

		if (newProduct.disponibilidad == 0) {
			newProduct.estado = 0;
		}

		const resData = validateData(newProduct);

		if (req.files === undefined) {	// Comprobación de subida de archivo.
			if (resData) {	// Validar que los datos sean del tipo deseado pasando la función
				return res.status(400).send("Los datos no son del tipo correcto");
			}

			await pool.query("UPDATE productos set ? WHERE codigo = ?", [newProduct, codigo]);
			return res.redirect("/admin/productos");

		} else {
			const photo = req.files.urlImagen;	// Se obtiene el objeto del archivo

			newProduct['urlImagen'] = photo;

			if (resData) {	// Validar que los datos sean del tipo deseado pasando la función
				deleteTempImage(photo.tempFilePath);
				return res.status(400).send("Los datos no son del tipo correcto");
			}

			if (validationFormatImage(photo)) {	// Validar que la imagen sea de las extensiones deseadas
				deleteTempImage(photo.tempFilePath);
				return res.status(400).send("La imagen debe ser de las extensiones deseadas");
			}

			if (photo.truncated) {	// Archivo excede el tamaño limite
				deleteTempImage(photo.tempFilePath);
				return res.status(400).send("La imagen excede el tamaño limite");
			}

			const [rows] = await pool.query("SELECT urlImagen FROM productos WHERE codigo = ?", [codigo]);
			const public_id = rows[0].urlImagen.split(".")[0];
			await cloudinary.uploader.destroy(public_id);

			const result = await cloudinary.uploader.upload(photo.tempFilePath, {	// Se sube la imagen a Cloudinary
				folder: "products",
			});

			newProduct.urlImagen = `${result.public_id}.${result.format}`;	// Se obtienenla URL de la imagen en Cloudinary
			deleteTempImage(photo.tempFilePath);

			const product = await pool.query("UPDATE productos set ? WHERE codigo = ?", [newProduct, codigo]);
			return res.redirect("/admin/productos");
		}
	} catch (error) {
		console.log(error);
		return res.status(400).send("Sucedio un error");
	}
};

//Función para desactivar los productos.
export const deleteProducts = async (req, res) => {
	try {
		const { id } = req.params;
		const [[resultado]] = await pool.query("SELECT estado, disponibilidad FROM productos WHERE codigo = ?", [id]);


		if (!resultado) {
			return res.redirect("/admin/productos");
		}

		const { estado, disponibilidad } = resultado;	//obtención del estado.


		if (estado == 1) {	//Se realiza el cambio del estado.
			await pool.query("UPDATE productos set estado = ? WHERE codigo = ?", [0, id]);
		} else {

			if (disponibilidad <= 0) {
				return res.status(400).send("No puedes activar un producto sin disponibilidad");
			}

			await pool.query("UPDATE productos set estado = ? WHERE codigo = ?", [1, id]);
		}

		res.redirect("/admin/productos");
	} catch (error) {
		console.log(error);
	}
};

export const parametrosImagen = fileUpload({
	useTempFiles: true,
	limits: { fileSize: 2 * 1024 * 1024 }	//Se tiene un limite de 2mb por archivo
});
