import { pool } from "../db.js";
import fs from "fs";
import { escape } from 'mysql2'; 
let form = {};
let query = "SELECT ventas.id, usuarios.usuario, ventas.fecha, ventas.total, ventas.tipoPago FROM ventas LEFT JOIN usuarios ON ventas.idUsuario = usuarios.id;";

export const renderPage = async(req, res) => {
    try{
        form.counter -= 1;
		if (form.counter === 0) {
			form = {};
			query = "SELECT ventas.id, usuarios.usuario, ventas.fecha, ventas.total, ventas.tipoPago FROM ventas LEFT JOIN usuarios ON ventas.idUsuario = usuarios.id;";
		}

        const [rows] = await pool.query(query);
        console.log(rows[0].fecha);

        res.render("admin/ventas.html", {
            title: "Admin - Ventas",
            ventas: rows,
            form,
            navLinks: [
                { class: "nav-link", link: "/", title: "Inicio" },
				{ class: "nav-link", link: "/admin/productos/", title: "Productos" },
				{ class: "nav-link active", link: "/admin/ventas/", title: "Ventas" },
				{ class: "nav-link", link: "/admin/categorias/", title: "Categorias" },
				{ class: "nav-link", link: "/admin/promociones/", title: "Promociones" },
            ],
            scripts: [
                "/js/bootstrap.bundle.min.js"
            ]
    
        });
    }catch(error){
        console.log(error + " Error al mostrar");
    }
};