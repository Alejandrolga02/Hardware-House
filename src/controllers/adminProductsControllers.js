import { pool } from "../db.js";
import cloudinary from '../cloudinary.js';
import fs from "fs";


//Función para mostrar todos los productos.
export const renderProducts = async (req, res) => {
	const [rows] = await pool.query("SELECT productos.codigo, productos.nombre, productos.descripcion, productos.precio, productos.urlImagen, productos.disponibilidad, productos.idCategoria, categorias.nombre AS categoria FROM productos LEFT JOIN categorias ON productos.idCategoria = categorias.id");
	const [categorias] = await pool.query("SELECT * FROM categorias");
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

//Función para crear un nuevo producto.
export const createProducts = async (req, res) => {
	try {
		const photo = req.files.urlImagen;	//Se obtiene el objeto del archivo
		const result = await cloudinary.uploader.upload(photo.tempFilePath, {	//Se ssube la imagen a Cloudinary
			folder: "products",
		});
		const url = result.url;	//Se obtienenla URL de la imagen en Cloudinary

		//Función para eliminar las imagenes temporales.
		try{
			fs.unlinkSync(photo.tempFilePath);
			console.log("Archivo removido");
		}catch(err){
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
		const rows = await pool.query("INSERT INTO productos set ?", [newProduct]);	//Se realiza la inserción.
		res.redirect("/admin/productos");	//Se redirecciona a la pagina de productos
		return;
		
	} catch (error) {
		console.log(error)
	}
};

export const editProducts = async (req, res) => {
	const { id } = req.params;
	const [result] = await pool.query("SELECT * FROM productos WHERE id = ?", [
		id,
	]);
	res.render("admin/productos.html", {
		title: "Editar Producto",
		customer: result[0]
	});
};

export const updateProducts = async (req, res) => {
	const { id } = req.params;
	const newCustomer = req.body;
	await pool.query("UPDATE productos set ? WHERE id = ?", [newCustomer, id]);
	res.redirect("/admin/productos");
};

//Función para desactivar los productos.
export const deleteProducts = async (req, res) => {
	const { id } = req.params;
	const [rows] = await pool.query("SELECT estado FROM productos WHERE codigo = ?", [id]);	
	const estado = rows[0].estado;	//obtención del estado.

	if(estado == 1){	//Se realiza el cambio del estado.
		const result = await pool.query("UPDATE productos set estado = ? WHERE codigo = ?", [0, id]);
		console.log("SE DESACTIVO")
		console.log(result);
	}else{
		const result = await pool.query("UPDATE productos set estado = ? WHERE codigo = ?", [1, id]);
		console.log("SE ACTIVO");
		console.log(result);
	}
	res.redirect("/admin/productos");
};


