import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { GAME_OVER, INIT_GAME, INQUEUE, EXIT_GAME, TIME_OUT } from "../App";
import { useGame } from "../store/game";

const gameSound = new Audio("/sounds/game-end.mp3");

export const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { setQueue, setGame, setOver } = useGame();

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SERVER_URL, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      setSocket(newSocket);
      console.log("🟢 Socket connected:", newSocket.id);
    });

    newSocket.on("message", (msg) => {
      if (msg?.type === INQUEUE) {
        setQueue();
      } else if (msg?.type === INIT_GAME) {
        gameSound.play();
        setGame({ ...msg.payload, isPending: false });
      } else if (msg?.type === GAME_OVER) {
        gameSound.play();
        setOver({ reason: msg.payload.reason, result: msg.payload.result });
      } else if (msg?.type === EXIT_GAME) {
        gameSound.play();
        setOver({ reason: msg.payload.reason, result: msg.payload.result });
      } else if (msg?.type === TIME_OUT) {
        gameSound.play();
        setOver({ reason: msg.payload.reason, result: msg.payload.result });
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
