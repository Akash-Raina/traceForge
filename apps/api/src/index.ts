import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import "dotenv/config"

const app = express();

app.use(cors())

app.use(express.json());

app.use("/api/v1", router);

const PORT = Number((process.env.PORT) || 8000);

app.listen(PORT);
