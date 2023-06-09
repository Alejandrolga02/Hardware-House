import { config } from 'dotenv'

config()

export const PORT = 80;
export const SECURE_PORT = 443;

// CLOUDINARY CREDENTIALS
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// DB CREDENTIALS
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const DB_PORT = process.env.DB_PORT;
export const DB_NAME = process.env.DB_NAME;

// JSON WEB TOKEN
export const SECRET_OR_PRIVATE_KEY = process.env.SECRET_OR_PRIVATE_KEY;

// SSL CERTIFICATES
export const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
export const SSL_CERT_PATH = process.env.SSL_CERT_PATH;
export const SSL_CA_PATH = process.env.SSL_CA_PATH;
