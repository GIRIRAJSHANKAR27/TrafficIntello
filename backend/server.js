import express, { json } from "express";
import { createServer } from "http";
import cors from "cors";

const app = express();
const server = createServer(app);

import  setupWebSocket from "./sockets/socketHandler.js";
import signalRoutes from "./routes/signalRoutes.js";

app.use(cors());
app.use(json());
app.use("/api/signals", signalRoutes);

setupWebSocket(server);

server.listen(3000, () => console.log("Server running on http://localhost:3000"));
