import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { GAME_OVER, INIT_GAME, INQUEUE, EXIT_GAME } from "../App";
import { useGame } from "../store/game";

const gameOverSound = new Audio("/sounds/game-end.mp3");

export const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { setQueue, setGame, setOver } = useGame();

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SERVER_URL, {
      withCredentials: true,
    });

    console.log("🔌 Connecting to socket server...");

    newSocket.on("connect", () => {
      setSocket(newSocket);
      console.log("🟢 Socket connected:", newSocket.id);
    });

    newSocket.on("message", (msg) => {
      if (msg?.type === INQUEUE) {
        setQueue();
        console.log("⏳ In queue...");
      }
      if (msg?.type === INIT_GAME) {
        setGame({ ...msg.payload, isPending: false });
        console.log("🧩 Game initialized", msg.payload);
      }
      if (msg?.type === GAME_OVER) {
        gameOverSound.play();
        setOver(msg.payload.winner);
      }
      if (msg?.type === EXIT_GAME) {
        gameOverSound.play();
        setOver(msg.payload.winner);
      }
    });

    newSocket.on("disconnect", () => {
      setSocket(null);

      console.log("🔴 Socket disconnected:", newSocket.id);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
};
