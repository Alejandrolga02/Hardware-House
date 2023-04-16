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
            isLogged: req.user.isLogged
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
            isLogged: req.user.isLogged
        })
    } catch (error) {
        console.log(error + " El error esta aquí");;
    }
};

//Función para filtrar los datos
function filterSearchVenta(obj) {
    const result = {};

    const regex = /\[(.*?)\]/;
    for (const key in obj) {
        if (key.startsWith('busqueda')) {
            const match = key.match(regex);
            if (match) {
                result[match[1]] = obj[key];
            }
        }
    }
    return result;
}


//Función para buscar por Id.
export const searchVentasId = async (req, res) => {
    try {
        let body = req.body;
        let searchVenta = filterSearchVenta(body);

        console.log(searchVenta);

        //Se revisa que se hayan enviado datos.
        if (Object.keys(searchVenta).length === 0) {
            return res.status(400).send("Añada contenido a la consulta");
        }

        //Se prepara la query
        query = "SELECT ventas.id, usuarios.usuario, DATE_FORMAT(ventas.fecha, '%d/%m/%Y') AS fecha, ventas.total, ventas.tipoPago FROM ventas LEFT JOIN usuarios ON ventas.idUsuario = usuarios.id WHERE ";

        let i = 0;
        for (const [key, value] of Object.entries(searchVenta)) {
            if (i === Object.keys(searchVenta).length - 1) {
                query += `ventas.${key} LIKE ${escape("%" + value + "%")}`;
            } else {
                query += `ventas.id${key} LIKE ${escape("%" + value + "%")} AND `;
            }

            form[key] = value;
            i++;
        }
        form.counter = 2;
        return res.status(200).send("Query creado exitosamente");
    } catch (error) {
        console.log(error);
    }
}

export const searchVentasFecha = async (req, res) => {
    try {
        let body = req.body;
        let searchVenta = filterSearchVenta(body);

        console.log(searchVenta.fechaIni);

        //Se revisa que se hayan enviado datos.
        if (Object.keys(searchVenta).length === 0) {
            return res.status(400).send("Añada contenido a la consulta");
        }

        //Se prepara la query
        query = `SELECT ventas.id, usuarios.usuario, DATE_FORMAT(ventas.fecha, '%d/%m/%Y') AS fecha, ventas.total, ventas.tipoPago FROM ventas LEFT JOIN usuarios ON ventas.idUsuario = usuarios.id WHERE fecha BETWEEN STR_TO_DATE('${searchVenta.fechaIni}', '%Y-%m-%d') AND STR_TO_DATE('${searchVenta.fechaFin}', '%Y-%m-%d');`

        form.counter = 2;
        return res.status(200).send("Query creado exitosamente");
    } catch (error) {
        console.log(error);
    }
}