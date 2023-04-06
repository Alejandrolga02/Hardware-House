import jwt from 'jsonwebtoken';
import { SECRET_OR_PRIVATE_KEY } from './config.js';
import { pool } from './db.js';

// Funcion para generar Json Web Token
export const generarJWT = (id = '') => {
	return new Promise((resolve, reject) => {
		// Define el cuerpo (payload) del JWT
		const payload = { id };

		// Creacion del JTW
		jwt.sign(payload, SECRET_OR_PRIVATE_KEY, {
			expiresIn: "2d",
		}, (err, token) => {
			if (err) {
				console.log(err);
				// Mandar error al back
				reject('No se pudo generar el token');
			} else {
				// Mandar token creado
				resolve(token);
			}
		});
	})
}

// Funcion para validar Json Web Token
export const validarJWT = async (req, res, next) => {
	// Obtencion del token
	const token = req.cookies.token;

	// Token no enviado
	if (!token) {
		return res.redirect("/login");
	}

	try {
		// Validar token
		const { id } = jwt.verify(token, SECRET_OR_PRIVATE_KEY);

		// Encontrar usuario correspondiente al id
		let [[user]] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);

		// Usuario no encotrado
		if (!user) {
			res.clearCookie('token');
			return res.redirect("/");
		}

		// Asignacion de valores
		req.body.isLogged = true;
		req.body.id = id;
		req.body.esAdmin = user.esAdmin;

		next();
	} catch (error) {
		console.log(error);
		return res.status(401).send("Token no válido");
	}
}

// Funcion para checar si un usuario no ha iniciado sesion
export const checkLogged = async (req, res, next) => {
	// Obtencion de token
	const token = req.cookies.token;

	// Si no hay token deja avanzar al siguiente middleware
	if (!token) {
		req.body.isLogged = false;
		req.body.esAdmin = 0;
		return next();
	}

	try {
		// Validar token
		const { id } = jwt.verify(token, SECRET_OR_PRIVATE_KEY);

		// Encontrar usuario correspondiente al id
		let [[user]] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);

		// Usuario no encotrado
		if (!user) {
			res.clearCookie('token');
			return next();
		}

		req.body.isLogged = true;
		req.body.esAdmin = user.esAdmin;

		if (req.body.esAdmin === 1) {
			// Si es admin te redirecciona a el menu
			return res.redirect('/admin/');
		} else if (req.body.esAdmin === 0) {
			// Si no es admin te redirecciona a la seccion de clientes
			return res.redirect('/');
		}

		// Si no es ninguno no existe el rol
		res.clearCookie('token');
		return next();
	} catch (error) {
		console.log(error);
		return res.status(401).send("Token no válido");
	}
}

export const validarAdmin = (req, res, next) => {
	try {
		// Obtiene isAdmin del body
		const { esAdmin } = req.body;

		// Si el rol es distinto a admin te manda un error
		if (esAdmin !== 1) {
			return res.redirect("/");
		}

		// Si eres admin te deja avanzar
		next();
	} catch (error) {
		console.log(error);
		return res.status(500).send("Sucedió un error, comunicate con el administrador");
	}
}

export const validarCliente = (req, res, next) => {
	try {
		// Obtiene esAdmin del body
		const { esAdmin } = req.body;

		if (esAdmin === 1) {
			// Si es admin te da descuento
			req.body.descuento = 10;
		} else {
			// Si no, no hay descuento
			req.body.descuento = 0;
		}

		return next();
	} catch (error) {
		console.log(error);
		return res.status(500).send("Sucedió un error, comunicate con el administrador");
	}
}

// Funcion para validar Json Web Token
export const isLogged = async (req, res, next) => {
	// Obtencion del token
	const token = req.cookies.token;

	// Token no enviado
	if (!token) {
		req.body.isLogged = false;
		req.body.esAdmin = 0;
		return next();
	}

	try {
		// Validar token
		const { id } = jwt.verify(token, SECRET_OR_PRIVATE_KEY);

		// Encontrar usuario correspondiente al id
		let [[user]] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);

		// Usuario no encotrado
		if (!user) {
			res.clearCookie('token');
			return res.redirect("/");
		}

		// Asignacion de valores
		req.body.isLogged = true;
		req.body.id = id;
		req.body.esAdmin = user.esAdmin;

		next();
	} catch (error) {
		console.log(error);
		res.clearCookie('token');
		return res.redirect("/");
	}
}