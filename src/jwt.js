import jwt from 'jsonwebtoken';
import { SECRET_OR_PRIVATE_KEY } from './config.js';
import { pool } from './db.js';

export const generarJWT = (id = '', esAdmin = 0) => {
	return new Promise((resolve, reject) => {
		const payload = { id, esAdmin };

		jwt.sign(payload, SECRET_OR_PRIVATE_KEY, {
			expiresIn: "7d",
		}, (err, token) => {
			if (err) {
				console.log(err);
				reject('No se pudo generar el token');
			} else {
				resolve(token);
			}
		});
	})
}

export const validarJWT = (req, res, next) => {
	const token = req.header('token');

	if (!token) {
		return res.status(401).send('No se mandó token en la petición')
	}

	try {
		const { id, esAdmin } = jwt.verify(token, SECRET_OR_PRIVATE_KEY);

		// Encontrar usuario correspondiente al id
		let [[user]] = pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);

		if (!user) {
			return res.status(400).send("El usuario no existe");
		}

		req.id = id;
		req.esAdmin = esAdmin;

		next();
	} catch (error) {
		console.log(error);
		return res.status(401).send("Token no válido");
	}
}

export const checkLogged = (req, res, next) => {
	const token = req.header('token');

	if (!token) {
		next();
	}

	try {
		const { esAdmin } = jwt.verify(token, SECRET_OR_PRIVATE_KEY);

		if (esAdmin === 1) {
			return res.redirect('/admin/');
		} else if (esAdmin === 0) {
			return res.redirect('/');
		} else {
			return res.status(400).send('Estatus desconocido');
		}
	} catch (error) {
		console.log(error);
		return res.status(401).send("Token no válido");
	}
}

export const validarAdmin = (req, res, next) => {
	try {
		const { isAdmin } = req.body;

		if (isAdmin !== 1) {
			return res.status("401").send("Necesitas ser administrador para acceder");
		}

		next();
	} catch (error) {
		console.log(error);
		return res.status("500").send("Sucedió un error, comunicate con el administrador");
	}
}

export const validarUser = (req, res, next) => {
	try {
		const { isAdmin } = req.body;

		if (isAdmin === 1) {
			return res.status("401").send("Un administrador no puede realizar esta acción");
		} else if (isAdmin === 0) {
			return next();
		} else {
			return res.status("401").send("Necesitas ser cliente para acceder");
		}

	} catch (error) {
		console.log(error);
		return res.status("500").send("Sucedió un error, comunicate con el administrador");
	}
}