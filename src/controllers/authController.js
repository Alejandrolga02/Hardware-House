import { pool } from "../db.js";
import { generarJWT } from "../jwt.js";
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import { estados } from '../estados.js';

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
                const token = await generarJWT(result.id);

                res.cookie('token', token, {
                    httpOnly: true,
                })

                res.status(200).json({
                    isAdmin: result.esAdmin,
                    message: "Sesion iniciada correctamente",
                });
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
        res.render("login.html", {
            title: "Iniciar sesion",
            navLinks: [
                { class: "nav-link active", link: "/", title: "Inicio" },
                { class: "nav-link", link: "/nosotros", title: "Nosotros" },
                { class: "nav-link", link: "/productos", title: "Productos" },
                { class: "nav-link", link: "/preguntas", title: "Preguntas Frecuentas" },
            ],
            scripts: [
                "/js/login.js"
            ],
            isLogged: req.user.isLogged
        });
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }
}

export const renderRegister = async (req, res) => {
    try {
        res.render("register.html", {
            title: "Registrarse",
            navLinks: [
                { class: "nav-link active", link: "/", title: "Inicio" },
                { class: "nav-link", link: "/nosotros", title: "Nosotros" },
                { class: "nav-link", link: "/productos", title: "Productos" },
                { class: "nav-link", link: "/preguntas", title: "Preguntas Frecuentas" },
            ],
            scripts: [
                "js/estados.js",
                "/js/register.js"
            ],
            isLogged: req.user.isLogged
        });
    } catch (error) {
        console.log(error);
        res.status(400).send("Sucedio un error");
    }
}

const validateUser = newUser => {
    try {
        let { usuario, contrasena, nombre, apellidos, correo, telefono, calle, colonia, numeroExterior, CP, estado, municipio } = newUser;

        // Usuario vacio
        if (!usuario || usuario.length === 0 || usuario.length > 60)
            return false;

        // Contraseña vacia
        if (!contrasena || contrasena.length === 0 || contrasena.length > 60)
            return false;

        // nombre vacio
        if (!nombre || nombre.length === 0 || nombre.length > 60)
            return false;

        // correo vacio
        if (!correo || correo.length === 0 || correo.length > 240)
            return false;

        // apellido vacio
        if (!apellidos || apellidos.length === 0 || apellidos.length > 60)
            return false;

        // telefono vacio
        if (!telefono || telefono.length === 0 || telefono.length > 12)
            return false;

        // calle vacia
        if (!calle || calle.length === 0 || calle.length > 120)
            return false;

        // colonia vacia
        if (!colonia || colonia.length === 0 || colonia.length > 60)
            return false;

        // numero exterior vacio
        if (!numeroExterior || numeroExterior.length === 0 || numeroExterior.length > 6)
            return false;

        // numero exterior vacio
        if (!CP || CP.length === 0 || CP.length > 5)
            return false;

        // estado invalido
        if (!estado || estado == "-1" || !estados[estado])
            return false;

        // municipio invalido
        if (!municipio || municipio == "-1" || !estados[estado].municipios[municipio])
            return false;

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const register = async (req, res) => {
    try {
        const newUser = req.body;

        if (!validateUser(newUser))
            return res.status(400).send("Datos invalidos");

        const salt = randomBytes(16).toString('hex');
        const hashedPassword = scryptSync(newUser.contrasena, salt, 64).toString('hex');
        newUser.contrasena = `${salt}:${hashedPassword}`;
        newUser.id = 0;
        newUser.esAdmin = 0;

        newUser.municipio = estados[newUser.estado].municipios[newUser.municipio];
        newUser.estado = estados[newUser.estado].nombre;

        const [[usuario]] = await pool.query("SELECT * FROM usuarios WHERE usuario = ?", [newUser.usuario]);
        const [[telefono]] = await pool.query("SELECT * FROM usuarios WHERE telefono = ?", [newUser.telefono]);
        const [[correo]] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [newUser.correo]);
        if (usuario || telefono || correo) {
            res.status(400).send("Ya existe ese usuario");
        } else {
            await pool.query("START TRANSACTION");

            await pool.query("INSERT INTO usuarios set ?", [newUser]);
            let [[{ id }]] = await pool.query("SELECT MAX(id) AS id FROM usuarios");

            await pool.query("COMMIT");

            const token = await generarJWT(id);

            res.cookie('token', token, {
                httpOnly: true,
            })

            res.status(200).json({
                isAdmin: 0,
                message: "Sesion iniciada correctamente",
            });
        }

    } catch (error) {
        console.log(error);
        res.status(400).send("Sucedio un error");
    }
}