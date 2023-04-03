import jwt from 'jsonwebtoken';
import { SECRET_OR_PRIVATE_KEY } from './config.js';
import { pool } from './db.js';

// Funcion para generar Json Web Token
export const generarJWT = (id = '', esAdmin = 0) => {
	return new Promise((resolve, reject) => {
		// Define el cuerpo (payload) del JWT
		const payload = { id, esAdmin };

		// Creacion del JTW
		jwt.sign(payload, SECRET_OR_PRIVATE_KEY, {
			expiresIn: "7d",
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
export const validarJWT = (req, res, next) => {
	// Obtencion del token
	const token = req.headers.authorization.split(' ')[1];

	// Token no enviado
	if (!token) {
		return res.status(401).send('No se mandó token en la petición')
	}

	try {
		// Validar token
		const { id, esAdmin } = jwt.verify(token, SECRET_OR_PRIVATE_KEY);

		// Encontrar usuario correspondiente al id
		let [[user]] = pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);

		// Usuario no encotrado
		if (!user) {
			return res.status(400).send("El usuario no existe");
		}

		// Asignacion de valores
		req.id = id;
		req.esAdmin = esAdmin;

		next();
	} catch (error) {
		console.log(error);
		return res.status(401).send("Token no válido");
	}
}

// Funcion para checar si un usuario no ha iniciado sesion
export const checkLogged = (req, res, next) => {
	// Obtencion de token
	const token = req.headers.authorization?.split(' ')[1];

	// Si no hay token deja avanzar al siguiente middleware
	if (!token) {
		return next();
	}

	try {
		// Validar token
		const { esAdmin } = jwt.verify(token, SECRET_OR_PRIVATE_KEY);

		if (esAdmin === 1) {
			// Si es admin te redirecciona a el menu
			return res.redirect('/admin/');
		} else if (esAdmin === 0) {
			// Si no es admin te redirecciona a la seccion de clientes
			return res.redirect('/');
		} else {
			// Si no es ninguno no existe el rol
			return res.status(400).send('Rol desconocido');
		}
	} catch (error) {
		console.log(error);
		return res.status(401).send("Token no válido");
	}
}

export const validarAdmin = (req, res, next) => {
	try {
		// Obtiene isAdmin del body
		const { isAdmin } = req.body;

		// Si el rol es distinto a admin te manda un error
		if (isAdmin !== 1) {
			return res.status("401").send("Necesitas ser administrador para acceder");
		}

		// Si eres admin te deja avanzar
		next();
	} catch (error) {
		console.log(error);
		return res.status("500").send("Sucedió un error, comunicate con el administrador");
	}
}

export const validarCliente = (req, res, next) => {
	try {
		// Obtiene isAdmin del body
		const { isAdmin } = req.body;

		if (isAdmin === 1) {
			// Si es admin te da error
			return res.status("401").send("Un administrador no puede realizar esta acción");
		} else if (isAdmin === 0) {
			// Si es cliente te deja avanzar
			return next();
		} else {
			// Si es otro rol te manda el mensaje
			return res.status("401").send("Necesitas ser cliente para acceder");
		}

	} catch (error) {
		console.log(error);
		return res.status("500").send("Sucedió un error, comunicate con el administrador");
	}
}