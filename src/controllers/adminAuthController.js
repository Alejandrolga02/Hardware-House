import { pool } from "../db.js";
import session from '../session.js'
import bcryptjs from 'bcryptjs'

export const login = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;
        const [result] = await pool.query("SELECT * FROM admin WHERE usuario = ?", [usuario, contrasena]);

        let equal = await bcryptjs.compare(contrasena, result[0].contrasena);

        if (equal) {
            session.id = result[0].id;
            session.isAdmin = true;
            session.isAuth = true;
            res.redirect("/admin/menu");
        } else {
            res.status(400).send("Usuario o contraseña incorrectas");
        }

    } catch (error) {
        console.log(error.message)
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

export const register = async (req, res) => {
    try {
        let newVendedor = req.body;
        newVendedor.contrasena = await bcryptjs.hash(newVendedor.contrasena, 10);
        newVendedor.id = 0;

        const [result] = await pool.query("SELECT * FROM admin WHERE usuario = ?", [newVendedor.usuario]);
        if (result.length > 0) {
            res.status(400).send("Ya existe ese usuario");
        } else {
            await pool.query("INSERT INTO admin set ?", [newVendedor]);
            res.status(200).send("Usuario creado con exito");
        }

    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(400).send("Sucedio un error");
    }

}