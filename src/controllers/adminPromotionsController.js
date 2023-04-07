import { pool } from '../db.js';
import { escape } from 'mysql2';

let query = "SELECT promociones.id, promociones.fechaInicio, promociones.fechaFin, promociones.nombre, promociones.porcentajeDescuento, promociones.estado, categorias.nombre AS categoria FROM promociones LEFT JOIN categorias ON promociones.idCategoria = categorias.id"
let form = {};

export const renderPromotions = async (req, res) => {
    try {

        form.counter -= 1;
        if (form.counter === 0) {
            form = {};
            query = "SELECT promociones.id, promociones.fechaInicio, promociones.fechaFin, promociones.nombre, promociones.porcentajeDescuento, promociones.estado, categorias.nombre AS categoria FROM promociones LEFT JOIN categorias ON promociones.idCategoria = categorias.id";
        }

        const [rows] = await pool.query(query);
        const [categorias] = await pool.query("SELECT * FROM categorias");

        res.render('admin/promociones.html', {
            title: "Admin - Promociones",
            promotions: rows,
            categorias,
            form,
            navLinks: [
                { class: "nav-link", link: "/", title: "Inicio" },
                { class: "nav-link", link: "/admin/productos/", title: "Productos" },
                { class: "nav-link", link: "/admin/ventas/", title: "Ventas" },
                { class: "nav-link", link: "/admin/categorias/", title: "Categorias" },
                { class: "nav-link active", link: "/admin/promociones/", title: "Promociones" },
            ],
            scripts: [
                "/js/admin-promotions.js"
            ],
            isLogged: req.body.isLogged
        });
    } catch (error) {
        console.log(error);
    }
};

export const editPromotions = async (req, res) => {
	try {
		const { id } = req.params;
		const [result] = await pool.query("SELECT * FROM promociones WHERE id = ?", [id]);
		const [categorias] = await pool.query("SELECT * FROM categorias");

		if (result.length === 0) {
			return res.redirect("/admin/promociones/");
		}

		if (categorias.length === 0) {
			return res.redirect("/admin/categorias/");
		}

		res.render("admin/editPromotion.html", {
			title: "Editar Promocion",
			promotion: result[0],
            categorias,
			navLinks: [
				{ class: "nav-link", link: "/", title: "Inicio" },
				{ class: "nav-link", link: "/admin/productos/", title: "Productos" },
				{ class: "nav-link", link: "/admin/ventas/", title: "Ventas" },
				{ class: "nav-link", link: "/admin/categorias/", title: "Categorias" },
				{ class: "nav-link active", link: "/admin/promociones/", title: "Promociones" },
			],
			scripts: [
				"/js/admin-edit-promotion.js"
			],
			isLogged: req.body.isLogged
		});
	} catch (error) {
		console.log(error);
	}
};


function filterSearchPromotion(obj) {
	const result = {};

	const regex = /\[(.*?)\]/;
	for (const key in obj) {
		if (key.startsWith('nuevabusqueda')) {
			const match = key.match(regex);
			if (match) {
				result[match[1]] = obj[key]; 
			}
		}
	}
	return result;
}

export const searchPromotions = async (req, res) => {
	try {
		let body = req.body;
		let searchPromotion = filterSearchPromotion(body);

		if (Object.keys(searchPromotion).length === 0) {
			return res.status(400).send("Añade contenido a la consulta");
		}

		query = "SELECT promociones.id, promociones.fechaInicio, promociones.fechaFin, promociones.nombre, promociones.porcentajeDescuento, promociones.estado, categorias.nombre AS categoria FROM promociones LEFT JOIN categorias ON promociones.idCategoria = categorias.id WHERE ";

		let i = 0;
		for (const [key, value] of Object.entries(searchPromotion)) {
			if (i === Object.keys(searchPromotion).length - 1) {
				query += `promociones.${key} LIKE ${escape("%" + value + "%")}`;
			} else {
				query += `promociones.${key} LIKE ${escape("%" + value + "%")} AND `;
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

export const createPromotions = async (req, res) => {
    try {
        let { codigo, nombre, fechaInicio, fechaFin, porcentajeDescuento, idCategoria } = req.body;

        if (false) {
            res.status(400).send("Los datos no son del tipo correcto");
        }
        if (false) {
            res.status(400).send("Existe un registro con ese código");
        }

        const newPromotion = {
            id: codigo.trim(),
            nombre: nombre.trim(),
            fechaInicio: fechaInicio.trim(),
            fechaFin: fechaFin.trim(),
            porcentajeDescuento: porcentajeDescuento.trim(),
            idCategoria: idCategoria.trim()
        }

        const rows = await pool.query("INSERT INTO promociones set ?", [newPromotion]);

        res.status(200).send("Se insertaron con exito los datos");
    }
    catch (error) {
        console.error(error);
        res.status(400).send("Sucedio un error");
    }
};

export const deletePromotions = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query("SELECT estado FROM promociones WHERE id = ?", [id]);
        const estado = rows[0].estado;

        if (estado == 1) {
            const result = await pool.query("UPDATE promociones set estado = ? WHERE id = ?", [0, id]);
        } else {
            const result = await pool.query("UPDATE promociones set estado = ? WHERE id = ?", [1, id]);
        }

        res.redirect("/admin/promociones");
    } catch (error) {
        console.log(error);
    }
};
