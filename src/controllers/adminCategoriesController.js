import { pool } from '../db.js';

export const renderCategories = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, nombre, estado FROM categorias");
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
            ]
        });
    } catch (error) {
        console.log(error);
    }
};

export const createCategories = async (req, res) => {
    try {
        let { codigo, nombre } = req.body;

        if (false) {
            res.status(400).send("Los datos no son del tipo correcto");
        }
        if (false) {
            res.status(400).send("Existe un registro con ese código");
        }

        const newCategorie = {
            id: codigo.trim(),
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

export const deleteCategories = async (req, res) => {
	try {
		const { id } = req.params;
		const [rows] = await pool.query("SELECT estado FROM categorias WHERE id = ?", [id]);
		const estado = rows[0].estado;

		if (estado == 1) {
			const result = await pool.query("UPDATE categorias set estado = ? WHERE id = ?", [0, id]);
		} else {
			const result = await pool.query("UPDATE categorias set estado = ? WHERE id = ?", [1, id]);
		}

		res.redirect("/admin/categorias");
	} catch (error) {
		console.log(error);
	}
};
