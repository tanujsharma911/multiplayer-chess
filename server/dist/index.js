import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import cookie from "cookie";
dotenv.config();
import { GameManager } from "./GameManager.js";
import authRoute from "./routes/auth.route.js";
import healthRoute from "./routes/health.route.js";
import { connectDB } from "./db/index.js";
import { extractAuthUser } from "./utils/extractAuthUser.js";
import { User } from "./SocketManager.js";
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
}));
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true,
    },
});
app.use(cookieParser());
app.use("/auth", authRoute);
app.use("/health", healthRoute);
const gameManager = new GameManager();
io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
        return next(new Error("Unauthorized"));
    }
    const cookies = cookie.parse(cookieHeader);
    const accessToken = cookies.accessToken;
    if (!accessToken) {
        return next(new Error("Unauthorized"));
    }
    const user = extractAuthUser(accessToken);
    socket.data.user = user;
    next();
});
io.on("connection", (socket) => {
    const userDetails = socket.data.user;
    if (!userDetails) {
        console.log("❌ Unauthorized socket connection attempt.");
        socket.disconnect();
        return;
    }
    const user = new User(userDetails?.userId, userDetails?.email, userDetails?.name, userDetails?.avatar, socket);
    console.log("✅ User connected:", user.email);
    gameManager.addUser(user);
    socket.on("disconnect", () => {
        gameManager.removeUser(user);
    });
});
connectDB().then(() => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log("\x1b[32m%s\x1b[0m", `⚙️  Server is running on port http://localhost:${PORT} ...`);
    });
});
//# sourceMappingURL=index.js.map