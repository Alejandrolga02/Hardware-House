import { pool } from '../db.js';
import { escape } from 'mysql2';
let query = "SELECT *FROM categorias";
let form = {};

export const renderCategories = async (req, res) => {
	try {
		form.counter -= 1;
		if (form.counter === 0) {
			form = {};
			query = "SELECT * FROM categorias";
		}

		const [rows] = await pool.query(query);
		res.render('admin/categorias.html', {
			title: "Admin - Categorias",
			categories: rows,
			navLinks: [
				{ class: "nav-link", link: "/", title: "Inicio" },
				{ class: "nav-link", link: "/admin/productos/", title: "Productos" },
				{ class: "nav-link", link: "/admin/ventas/", title: "Ventas" },
				{ class: "nav-link active", link: "/admin/categorias/", title: "Categorias" },
				{ class: "nav-link", link: "/admin/promociones/", title: "Promociones" },
			],
			scripts: [
				"/js/admin-categorias.js"
			],
			isLogged: req.user.isLogged
		});
	} catch (error) {
		console.log(error);
	}
};

export const createCategories = async (req, res) => {
	try {
		let { id, nombre } = req.body;

		if (false) {
			res.status(400).send("Los datos no son del tipo correcto");
		}
		if (false) {
			res.status(400).send("Existe un registro con ese código");
		}

		const newCategorie = {
			id: id.trim(),
			nombre: nombre.trim(),
			estado: 1
		}

		const rows = await pool.query("INSERT INTO categorias set ?", [newCategorie]);

		res.status(200).send("Se insertaron con exito los datos");
	}
	catch (error) {
		console.error(error);
		res.status(400).send("Sucedio un error");
	}
};

export const editCategories = async (req, res) => {
	try {
		const { id } = req.params;
		const [result] = await pool.query("SELECT * FROM categorias WHERE id = ?", [id]);

		if (result.length === 0) {
			return res.redirect("/admin/categorias/");
		}

		res.render("admin/editCategorie.html", {
			title: "Editar Categoria",
			categorie: result[0],
			navLinks: [
				{ class: "nav-link", link: "/", title: "Inicio" },
				{ class: "nav-link", link: "/admin/productos/", title: "Productos" },
				{ class: "nav-link", link: "/admin/ventas/", title: "Ventas" },
				{ class: "nav-link active", link: "/admin/categorias/", title: "Categorias" },
				{ class: "nav-link", link: "/admin/promociones/", title: "Promociones" },
			],
			scripts: [
				"/js/admin-edit-categorie.js"
			],
			isLogged: req.user.isLogged
		});
	} catch (error) {
		console.log(error);
	}
};

function filterSearchCategorie(obj) {
	const result = {};

	const regex = /\[(.*?)\]/;
	for (const key in obj) {
		if (key.startsWith('searchCategorie')) {
			const match = key.match(regex);
			if (match) {
				result[match[1]] = obj[key];
			}
		}
	}
	return result;
}

export const searchCategories = async (req, res) => {
	try {
		let body = req.body;
		let searchCategorie = filterSearchCategorie(body);

		if (Object.keys(searchCategorie).length === 0) {
			return res.status(400).send("Añade contenido a la consulta");
		}

		query = "SELECT *FROM categorias WHERE ";

		let i = 0;
		for (const [key, value] of Object.entries(searchCategorie)) {
			if (i === Object.keys(searchCategorie).length - 1) {
				query += `categorias.${key} LIKE ${escape("%" + value + "%")}`;
			} else {
				query += `categorias.${key} LIKE ${escape("%" + value + "%")} AND `;
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

const validateString = (cadena) => {
	try {
		let regex = new RegExp(/^[A-Za-z0-9áéíóúÁÉÍÓÚ\s]+$/g);
		return regex.test(cadena);	//Retorna 'true' si no contiene caracteres especiales
	} catch (error) {
		console.log(error);
	}
}


const validateData = (product) => {
	try {
		if (!validateString(product.id) || (product.id == " ") || product.id.length > 20) {	//Convierte en false en 'true'
			return true;
		}

		if (!validateString(product.nombre) || (product.nombre == " ") || product.nombre.length > 60) {
			return true;
		}

		if (isNaN(product.estado) || product.estado < 0 || product.estado > 1) {
			return true;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
	return false;
}

const validateCode = async (codigo) => {
	try {
		const [[categorias]] = await pool.query("SELECT categorias.id FROM categorias WHERE id = ?", [codigo]);

		return categorias !== undefined;
	} catch (error) {
		console.log(error);
	}
}

export const updateCategories = async (req, res) => {
	try {

		const { id } = req.params;
		let codigo = req.body.id;

		console.log(id);
		console.log(codigo);

		if (id !== codigo) {
			return res.status(400).send("No alterar los códigos");
		}

		if (!await validateCode(id)) {
			return res.status(400).send("No existe ese registro a modificar");
		}

		const newCategorie = {
			id,
			nombre: req.body.nombre,
			estado: parseInt(req.body.estado)
		}

		const resData = validateData(newCategorie);

		if (resData) {
			return res.status(400).send("Los datos no son del tipo correcto");
		}

		try {
			await pool.query("UPDATE categorias set ? WHERE id = ?", [newCategorie, id]);
			return res.redirect("/admin/categorias");
		} catch(error) {
			console.log(error);
			return res.status(400).send("Sucedio un error al actualizar la categoria");
		}

	} catch (error) {
		console.log(error);
		return res.status(400).send("Sucedio un error");
	}
};

export const deleteCategories = async (req, res) => {
	try {
		const { id } = req.params;
		const [[rows]] = await pool.query("SELECT estado FROM categorias WHERE id = ?", [id]);

		if (!rows) {
			return res.redirect("/admin/categorias/");
		}

		const { estado } = rows;

		if (estado == 1) {
			await pool.query("UPDATE categorias set estado = ? WHERE id = ?", [0, id]);
		} else {
			await pool.query("UPDATE categorias set estado = ? WHERE id = ?", [1, id]);
		}

		res.redirect("/admin/categorias");
	} catch (error) {
		console.log(error);
	}
};
