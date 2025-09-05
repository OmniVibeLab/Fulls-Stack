import express from "express"
import morgan from "morgan";
import indexRoutes from "./routes/index.routes"
import { errorMiddleware } from "./middlewares/error";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser"
export const app = express()
app.use(morgan("dev"));
app.use(express.json())
app.use(cookieParser())
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);
app.use("/api/v1", indexRoutes)
app.use((req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
})
app.use(errorMiddleware)