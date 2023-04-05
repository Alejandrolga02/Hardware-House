import { pool } from '../db.js';

let form = {};

export const renderPromotions = async (req, res) => {
    try {

        form.counter -= 1;
        if (form.counter === 0) {
            form = {};
        }

        const [rows] = await pool.query("SELECT id, fechaInicio, fechaFin, nombre, porcentajeDescuento, idCategoria, estado FROM promociones");
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
            ]
        });
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
