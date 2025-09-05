import { config } from "dotenv"
config()
export const {
    PORT,
    DB_URI,
    JWT_SECRET,
    NODE_ENV,
    REDIS_URL,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_API_KEY,
    CLIENT_URI
} = process.env