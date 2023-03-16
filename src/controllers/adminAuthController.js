import { pool } from "../db.js";
import session from '../session.js'

export const login = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;
        console.log(usuario);
        console.log(contrasena);
        const [result] = await pool.query("SELECT * FROM vendedor WHERE usuario = ? AND contrasena = ?", [usuario, contrasena]);
        session.id = result[0].id;
        session.isAdmin = true;
        session.isAuth = true;
        console.log(session);
        res.redirect("/admin/menu")
    } catch (error) {
        res.redirect("/admin/auth");
    }
}

export const renderLogin = async (req, res) => {
    res.render("admin/login.html", {
        title: "Admin - Login",
        scripts: [
            "/js/bootstrap.bundle.min.js",
        ]
    });
}

export const logout = async (req, res) => {
    try {
        session.clearSession();
        res.redirect("/admin/auth");
    } catch (error) {
        console.log(error.message);
    }
}