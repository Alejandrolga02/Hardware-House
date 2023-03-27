import {pool} from '../db.js';

let form = {};

export const renderPromotions = async(req, res) => {
    try {

        form.counter -= 1;
		if (form.counter === 0) {
			form = {};
		}

        const [rows] = await pool.query("SELECT id, fechaInicio, fechaFin, nombre, porcentajeDescuento, idCategoria FROM promociones");
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
                "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
                "/js/bootstrap.bundle.min.js",
                //"/js/admin-promociones.js"
            ]
        });
    } catch (error) {
        console.log(error);
    }
};