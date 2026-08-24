import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import "dotenv/config"

const app = express();

console.log("🚀 TraceForge API started");

app.use(cors())

app.use((req, _res, next) => {
  console.log("➡️", req.method, req.originalUrl);
  next();
});

app.use(express.json());

app.use("/api/v1", router);

const PORT = Number((process.env.PORT) || 8000);

app.listen(PORT);
