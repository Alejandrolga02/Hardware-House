import http from 'http';
import https from 'https';
import fs from 'fs';

import app from "./app.js";
import { PORT, SECURE_PORT, SSL_CA_PATH, SSL_CERT_PATH, SSL_KEY_PATH } from "./config.js";

https.createServer({
	key: fs.readFileSync(SSL_KEY_PATH),
	ca: fs.readFileSync(SSL_CA_PATH),
	cert: fs.readFileSync(SSL_CERT_PATH),
}, app).listen(SECURE_PORT, "alejandrolizarraga.tech");

http.createServer((req, res) => {
	res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
	res.end();
}).listen(PORT);

console.log(`Servidor con SSL en PUERTO ${SECURE_PORT}`);