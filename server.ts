import { app } from "./app";
import { connectToDB } from "./config/dbConnection.config";
import { PORT } from "./config/env.config";
import { initSocketServer } from "./socketServer";

initSocketServer(app.listen(PORT, () => {
    connectToDB().then(() => {
        console.log(`Serving on http://localhost:${PORT}`);
    })
}))