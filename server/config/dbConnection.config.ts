import mongoose from "mongoose";
import { DB_URI } from "../config/env.config";
export const connectToDB = async () => {
    try {
        if (!DB_URI) {
            throw new Error("Database URI is not defined");
        }

        const { connection } = await mongoose.connect(DB_URI, {
            dbName: "Social-Media",
        });
        console.log(`DB Connected to ${connection.host}`);
    } catch (error: any) {
        console.error("DB Connection failed:", error.message);
        setTimeout(connectToDB, 3000);
    }
};
