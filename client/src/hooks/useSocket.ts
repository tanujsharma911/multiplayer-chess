import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  GAME_OVER,
  INIT_GAME,
  INQUEUE,
  EXIT_GAME,
  TIME_OUT,
  CHAT,
} from '../App';
import { useGame } from '../store/game';
import { useNavigate } from 'react-router';

const gameSound = new Audio('/sounds/game-end.mp3');

export const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { setQueue, setGame, setOver, setChat } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SERVER_URL, {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      setSocket(newSocket);
    });

    newSocket.on('message', (msg) => {
      if (msg?.type === INQUEUE) {
        setQueue();
      } else if (msg?.type === INIT_GAME) {
        gameSound.play();
        setGame({ ...msg.payload, isPending: false });
        navigate('/game/' + msg.payload.gameId);
      } else if (msg?.type === GAME_OVER) {
        gameSound.play();
        setOver({ reason: msg.payload.reason, result: msg.payload.result });
      } else if (msg?.type === EXIT_GAME) {
        gameSound.play();
        setOver({ reason: msg.payload.reason, result: msg.payload.result });
      } else if (msg?.type === TIME_OUT) {
        gameSound.play();
        setOver({ reason: msg.payload.reason, result: msg.payload.result });
      } else if (msg?.type === CHAT) {
        setChat({
          from: msg.payload.from,
          message: msg.payload.message,
          time: msg.payload.time,
        });
      }
    });

    newSocket.on('disconnect', () => {
      setSocket(null);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
};
