import { pool } from "../db.js";

export const login = async (req, res) => {
    const { usuario, contrasena } = req.body;
    console.log(usuario);
    console.log(contrasena)
	const [result] = await pool.query("SELECT * FROM vendedor WHERE usuario = ? AND contrasena = ?", [usuario, contrasena]);
    console.log(result);
}