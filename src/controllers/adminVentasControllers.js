import { pool } from "../db.js";
import fs from "fs";
import { escape } from 'mysql2';
let form = {};
let query = "SELECT ventas.id, usuarios.usuario, DATE_FORMAT(ventas.fecha, '%d/%m/%Y') AS fecha, ventas.total, ventas.tipoPago FROM ventas LEFT JOIN usuarios ON ventas.idUsuario = usuarios.id;";

export const renderPage = async (req, res) => {
    try {
        form.counter -= 1;
        if (form.counter === 0) {
            form = {};
            query = "SELECT ventas.id, usuarios.usuario, DATE_FORMAT(ventas.fecha, '%d/%m/%Y') AS fecha, ventas.total, ventas.tipoPago FROM ventas LEFT JOIN usuarios ON ventas.idUsuario = usuarios.id;";
        }

        const [rows] = await pool.query(query);

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
                "/js/admin-ventas.js"
            ],
            isLogged: req.body.isLogged
        });
    } catch (error) {
        console.log(error + " Error al mostrar");
    }
};

export const renderVentasDet = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query("SELECT ventas_detalle.idVenta, productos.nombre, ventas_detalle.cantidad FROM ventas_detalle LEFT JOIN productos ON ventas_detalle.idProducto = productos. codigo WHERE ventas_detalle.idVenta = ?", [id]);
        res.render("admin/ventasDetalles.html", {
            title: "Detalles de las Venta",
            ventasDetalles: rows,
            navLinks: [
                { class: "nav-link", link: "/", title: "Inicio" },
                { class: "nav-link", link: "/admin/productos/", title: "Productos" },
                { class: "nav-link active", link: "/admin/ventas/", title: "Ventas" },
                { class: "nav-link", link: "/admin/categorias/", title: "Categorias" },
                { class: "nav-link", link: "/admin/promociones/", title: "Promociones" },
            ],
            isLogged: req.body.isLogged
        })
    } catch (error) {
        console.log(error + " El error esta aquí");;
    }
};

//Función para buscar por Id.
export const searchVentas = async (req, res) =>{

}