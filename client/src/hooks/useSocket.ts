import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { GAME_OVER, INIT_GAME, INQUEUE } from "../App";
import { useGame } from "../store/game";

export const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { setQueue, setGame, setOver } = useGame();

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_WS_URL);

    newSocket.on("connect", () => {
      setSocket(newSocket);
    });

    newSocket.on("message", (msg) => {
      if (msg?.type === INQUEUE) {
        setQueue();
      }
      if (msg?.type === INIT_GAME) {
        setGame(msg.payload);
      }
      if (msg?.type === GAME_OVER) {
        setOver();
      }
    });

    newSocket.on("disconnect", () => {
      setSocket(null);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
};
