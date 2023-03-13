import express from "express";
import path from "path";
import morgan from "morgan";
import ejs from "ejs";

import routes from "./routes/index.js";
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
app.use(routes);

// static files
app.use(express.static(path.join(__dirname, "public")));

// starting the server
export default app;