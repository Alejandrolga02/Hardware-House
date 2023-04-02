import { pool } from "../db.js";
import session from '../session.js'
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'

export const login = async (req, res) => {
    try {
        // Obtencion de usuario y contraseña
        let { usuario, contrasena } = req.body;

        // Validar usuario
        if (typeof usuario !== 'string' || usuario.trim().length > 60) {
            return res.status(400).send("Usuario o contraseña incorrectas");
        }

        if (usuario.trim().length == 0) {
            return res.status(400).send("El usuario es obligatorio");
        }

        // Validar contraseña
        if (typeof contrasena !== 'string' || contrasena.trim().length > 60) {
            return res.status(400).send("Usuario o contraseña incorrectas");
        }

        if (contrasena.trim().length == 0) {
            return res.status(400).send("La contraseña es obligatoria");
        }

        // Eliminar espacios vacios a usuario y contraseña
        usuario = usuario.trim();
        contrasena = contrasena.trim();

        // Consultar si usuario existe en la bd
        const [[result]] = await pool.query("SELECT * FROM usuarios WHERE usuario = ?", [usuario]);

        if (result === undefined) {
            res.status(400).send("Usuario o contraseña incorrectas");
        } else {
            // Comparación de contraseña
            const [salt, key] = result.contrasena.split(':');
            const hashedBuffer = scryptSync(contrasena, salt, 64);
            const keyBuffer = Buffer.from(key, 'hex');

            const match = timingSafeEqual(hashedBuffer, keyBuffer);

            if (match) {
                session.setSession(result.id, true, true);

                res.status(200).send("Sesion iniciada correctamente");
            } else {
                res.status(400).send("Usuario o contraseña incorrectas");
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Sucedio un error");
    }
}

export const renderLogin = async (req, res) => {
    try {
        res.render("admin/login.html", {
            title: "Admin - Login",
            navLinks: [
                { class: "nav-link active", link: "/", title: "Iniciar Sesión" },
            ],
            scripts: [
                "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
                "/js/bootstrap.bundle.min.js",
                "/js/login.js"
            ]
        });
    } catch (error) {
        console.log(error);
    }
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
        let newUser = req.body;

        const salt = randomBytes(16).toString('hex');
        const hashedPassword = scryptSync(newUser.contrasena, salt, 64).toString('hex');
        newUser.contrasena = `${salt}:${hashedPassword}`;
        newUser.id = 0;


        const [result] = await pool.query("SELECT * FROM usuarios WHERE usuario = ?", [newUser.usuario]);
        if (result.length > 0) {
            res.status(400).send("Ya existe ese usuario");
        } else {
            await pool.query("INSERT INTO usuarios set ?", [newUser]);
            res.status(200).send("Usuario creado con exito");
        }

    } catch (error) {
        console.log(error);
        res.status(400).send("Sucedio un error");
    }
}