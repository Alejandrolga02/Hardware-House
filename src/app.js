import express from "express";
import path from "path";
import morgan from "morgan";
import ejs from "ejs";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// settings
app.set("port", process.env.PORT || 80);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// Cambiar extensiones ejs a html
app.engine("html", ejs.renderFile);

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

// routes
import adminProductos from "./routes/adminProductos.js";
import adminCategorias from "./routes/adminCategorias.js";
import adminPromociones from "./routes/adminPromociones.js";
import adminAuth from "./routes/adminAuth.js";
import adminIndex from "./routes/adminIndex.js";
import client from "./routes/clients.js";
import session from './session.js';
session.clearSession();

const apiPaths = {
	adminProductos: '/admin/productos',
	adminCategorias: '/admin/categorias',
	adminPromociones: '/admin/promociones',
	adminAuth: '/admin/auth',
	adminIndex: '/admin',
	client: '/'
}

// static files
app.use(express.static(path.join(__dirname, "public")));

app.use(apiPaths.adminIndex, adminIndex);
app.use(apiPaths.adminProductos, adminProductos);
app.use(apiPaths.adminCategorias, adminCategorias);
app.use(apiPaths.adminPromociones, adminPromociones);
app.use(apiPaths.adminAuth, adminAuth);
app.use(apiPaths.client, client);


// starting the server
export default app;