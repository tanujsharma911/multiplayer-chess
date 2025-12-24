import express from "express";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Server } from "socket.io";
const app = express();
const server = createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
    socket.on("message", (msg) => {
        console.log("💬", msg);
    });
    socket.on("error", console.log);
});
server.listen(3000, () => {
    console.log("⚙️ server running at http://localhost:3000");
});
//# sourceMappingURL=index.js.map