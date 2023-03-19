import { pool } from '../db.js';

export const renderCategories = async (req, res)=> {
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
            "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
            "/js/bootstrap.bundle.min.js",
            //"/js/admin-productos.js"
        ]
    });
};