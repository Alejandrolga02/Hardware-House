import http from 'http';
import https from 'https';
import fs from 'fs';

import app from "./app.js";
import { PORT, SECURE_PORT, SSL_CERT_PATH, SSL_KEY_PATH } from "./config.js";

const options = {
	key: fs.readFileSync(SSL_KEY_PATH),
	cert: fs.readFileSync(SSL_CERT_PATH)
};

https.createServer(options, app).listen(SECURE_PORT);

http.createServer((req, res) => {
	res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
	res.end();
}).listen(PORT);

console.log(`Servidor con SSL en PUERTO ${SECURE_PORT}`);