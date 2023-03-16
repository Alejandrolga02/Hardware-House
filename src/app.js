import express from "express";
import path from "path";
import morgan from "morgan";
import ejs from "ejs";
import fileUpload from "express-fileupload";

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
import adminAuth from "./routes/adminAuth.js";

const apiPaths = {
	adminProductos: '/admin/productos',
	adminAuth: '/admin/auth'
}

app.use(apiPaths.adminProductos, adminProductos);
app.use(apiPaths.adminAuth, adminAuth);

// static files
app.use(express.static(path.join(__dirname, "public")));

// starting the server
export default app;