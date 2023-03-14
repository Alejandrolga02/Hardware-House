import { pool } from "../db.js";
import cloudinary from '../cloudinary.js';

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
			"/js/admin-productos.js"
		]
	});
};

export const createProducts = async (req, res) => {
	try {
		const newProduct = req.body;
		console.log(newProduct.urlImagen)
		const result = await cloudinary.uploader.upload(newProduct.urlImagen, {
			folder: "products"
		})
		console.log(result);

		return;
		await pool.query("INSERT INTO productos set ?", [newCustomer]);
		res.redirect("/admin/productos");
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

export const deleteProducts = async (req, res) => {
	const { id } = req.params;
	const result = await pool.query("DELETE FROM productos WHERE id = ?", [id]);
	if (result.affectedRows === 1) {
		res.json({ message: "Customer deleted" });
	}
	res.redirect("/admin/productos");
};