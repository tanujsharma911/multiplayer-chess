import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { GameManager } from "./GameManager.js";
const app = express();
const server = createServer(app);
const io = new Server(server);
const gameManager = new GameManager();
io.on("connection", (socket) => {
    gameManager.addUser(socket);
    console.log("🟢 User is connected", socket.id);
    socket.on("disconnect", () => {
        gameManager.removeUser(socket);
        console.log("🔴 User disconnected", socket.id);
    });
});
server.listen(3000, () => {
    console.log("⚙️ server running at http://localhost:3000");
});
//# sourceMappingURL=index.js.map