import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { auth } from "express-openid-connect";

import { GameManager } from "./GameManager.js";

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: "a long, randomly-generated string stored in env",
  baseURL: "http://localhost:5173",
  clientID: "WY2J8CFAMFBLldE1Q8U4ovI6eAzZxfMJ",
  issuerBaseURL: "https://dev-tlhxpcz3x0cr3z15.us.auth0.com",
};

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

app.use(auth(config));

app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

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
