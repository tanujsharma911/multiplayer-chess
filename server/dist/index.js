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
import gameRoute from "./routes/game.route.js";
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
        origin: [process.env.CORS_ORIGIN || "*"],
        credentials: true,
    },
});
app.use(cookieParser());
app.use("/auth", authRoute);
app.use("/health", healthRoute);
app.use("/game", gameRoute);
const gameManager = new GameManager();
io.use((socket, next) => {
    try {
        const cookieHeader = socket.handshake.headers.cookie;
        if (!cookieHeader) {
            return next(new Error("Unauthorized: no cookies")); // TODO: What this passes
        }
        const cookies = cookie.parse(cookieHeader);
        const accessToken = cookies.accessToken;
        if (!accessToken) {
            return next(new Error("Unauthorized: no access token"));
        }
        const user = extractAuthUser(accessToken);
        socket.data.user = null;
        if (user) {
            socket.data.user = {
                userId: user.userId,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
            };
        }
        next();
    }
    catch (error) {
        console.error("❌ Socket authentication error:", error);
        next(new Error("Unauthorized: invalid token"));
    }
});
io.on("connection", (socket) => {
    const userDetails = socket.data.user;
    if (!userDetails) {
        console.log("❌ Unauthorized socket connection attempt.");
        socket.disconnect();
        return;
    }
    const user = new User(userDetails?.userId, null, userDetails?.email, userDetails?.name, userDetails?.avatar, socket);
    gameManager.addUser(user);
});
connectDB().then(() => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log("\x1b[32m%s\x1b[0m", `⚙️  Server is running on port http://localhost:${PORT} ...`);
    });
});
//# sourceMappingURL=index.js.map