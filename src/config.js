import { config } from 'dotenv'

config()

export const port = process.env.PORT || 80;

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
