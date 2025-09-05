import { app } from "./app";
import { connectToDB } from "./config/dbConnection.config";
import { PORT } from "./config/env.config";

app.listen(PORT, () => {
    connectToDB().then(() => {
        console.log(`Serving on http://localhost:${PORT}`);
    })
})