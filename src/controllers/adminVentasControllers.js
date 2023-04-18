import { pool } from "../db.js";
import fs from "fs";
import { escape } from 'mysql2';
let form = {};
let query = "SELECT ventas.id, usuarios.usuario, usuarios.id AS idUsuario, DATE_FORMAT(ventas.fecha, '%d/%m/%Y') AS fecha, ventas.total, ventas.tipoPago FROM ventas LEFT JOIN usuarios ON ventas.idUsuario = usuarios.id;";

export const renderPage = async (req, res) => {
    try {
        form.counter -= 1;
        if (form.counter === 0) {
            form = {};
            query = "SELECT ventas.id, usuarios.usuario, usuarios.id AS idUsuario, DATE_FORMAT(ventas.fecha, '%d/%m/%Y') AS fecha, ventas.total, ventas.tipoPago FROM ventas LEFT JOIN usuarios ON ventas.idUsuario = usuarios.id;";
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

        //Se revisa que se hayan enviado datos.
        if (Object.keys(searchVenta).length === 0) {
            return res.status(400).send("Añada contenido a la consulta");
        }

        //Se prepara la query
        query = "SELECT ventas.id, usuarios.usuario, usuarios.id AS idUsuario, DATE_FORMAT(ventas.fecha, '%d/%m/%Y') AS fecha, ventas.total, ventas.tipoPago FROM ventas LEFT JOIN usuarios ON ventas.idUsuario = usuarios.id WHERE ";

        if (!searchVenta.id || isNaN(searchVenta.id)) {
            delete searchVenta.id;
        } else {
            if (isNaN(searchVenta.id) || searchVenta.id <= 0) {
                return res.status(400).send(`El Id ingresado no es valido`);
            }

            query += `ventas.id = ${escape(searchVenta.id)} `;

            if (Object.keys(searchVenta).length === 2) {
                query += " AND "
            }
        }

        if (!searchVenta.Usuario) {
            delete searchVenta.Usuario;
        } else {
            query += `usuarios.usuario LIKE ${escape('%' + searchVenta.Usuario + '%')}`
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

        //Se revisa que se hayan enviado datos.
        if ((Object.keys(searchVenta).length === 0) || (Object.keys(searchVenta).length === 1)) {
            return res.status(400).send("Añada contenido a la consulta");
        }

        let startDate = new Date(searchVenta.fechaIni);
        let endDate = new Date(searchVenta.fechaFin);
        let currentDate = new Date();

        if (startDate.getTime() > currentDate.getTime() || endDate.getTime() > currentDate.getTime()) {
            return res.status(400).send("Una fecha es mayor que la actual");
        }

        if (searchVenta.fechaIni > searchVenta.fechaFin) {
            return res.status(400).send("La fecha inicial es mayor a la fecha final");
        }


        //Se prepara la query
        query = `SELECT ventas.id, usuarios.usuario, usuarios.id AS idUsuario, DATE_FORMAT(ventas.fecha, '%d/%m/%Y') AS fecha, ventas.total, ventas.tipoPago FROM ventas LEFT JOIN usuarios ON ventas.idUsuario = usuarios.id WHERE fecha BETWEEN STR_TO_DATE('${searchVenta.fechaIni}', '%Y-%m-%d') AND STR_TO_DATE('${searchVenta.fechaFin}', '%Y-%m-%d');`

        form.counter = 2;
        return res.status(200).send("Query creado exitosamente");
    } catch (error) {
        console.log(error);
    }
}

export const searchVentasTotales = async (req, res) => {
    try {
        let body = req.body;
        let searchVenta = filterSearchVenta(body);

        //Se revisa que se hayan enviado datos.
        if (Object.keys(searchVenta).length === 0 || (Object.keys(searchVenta).length === 1)) {
            return res.status(400).send("Añada contenido a la consulta");
        }

        //Validación de los datos
        if (isNaN(searchVenta.totalIni) || searchVenta.totalIni < 0) {
            return res.status(400).send("Total Inicial Invalido");
        }

        if (isNaN(searchVenta.totalFin) || searchVenta.totalFin <= 0) {
            return res.status(400).send("Total Inicial Invalido");
        }

        if (parseFloat(searchVenta.totalIni) >= parseFloat(searchVenta.totalFin)) {
            return res.status(400).send("Total Final debe ser mayor a Total Inicial");
        }

        //Se prepara la query
        query = `SELECT ventas.id, usuarios.usuario, usuarios.id AS idUsuario, DATE_FORMAT(ventas.fecha, '%d/%m/%Y') AS fecha, ventas.total, ventas.tipoPago FROM ventas LEFT JOIN usuarios ON ventas.idUsuario = usuarios.id WHERE total BETWEEN ${searchVenta.totalIni} AND ${searchVenta.totalFin};`;

        form.counter = 2;
        return res.status(200).send("Query creado exitosamente");
    } catch (error) {
        console.log(error);
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params;

    if (isNaN(id) || id <= 0) {
        return res.status(400).send("Usuario invalido");
    }

    let [[user]] = await pool.query("SELECT esAdmin, nombre, apellidos, usuario, estado, municipio, numeroExterior, colonia, CP, calle, correo, telefono FROM usuarios WHERE id = ?", [id]);

    return res.json(user);
}