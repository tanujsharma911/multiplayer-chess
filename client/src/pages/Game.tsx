import { Chess } from "chess.js";
import Board from "../components/Board";
import { useSocketStore } from "../store/socket";
import { useEffect, useState } from "react";
import { INIT_GAME, MOVE } from "../App";
import { useGame } from "../store/game";

type messageType = {
  type: string;
  payload: {
    board: string;
    turn: "w" | "b";
  };
};

const Game = () => {
  const { socket } = useSocketStore();

  const [chess, setChess] = useState(new Chess());
  const [boardVerision, setBoardVerision] = useState(0);

  const { game, setTurn } = useGame();

  useEffect(() => {
    if (!socket) return undefined;
    socket.emit("message", { type: INIT_GAME });

    const handler = (msg: messageType) => {
      if (msg.type === MOVE) {
        console.log("message from server:", msg);
        const newChess = new Chess(msg.payload.board);

        setBoardVerision((v) => v + 1);

        setChess(newChess);
        setTurn(msg.payload.turn);
      }
    };

    socket.on("message", handler);

    return () => {
      socket.off("message", handler);
    };
  }, [socket]);

  return (
    <div className="h-full">
      <div className="max-w-5xl mx-auto h-full gap-4 p-4 grid grid-cols-1 md:grid-cols-[auto_1fr]">
        <div>
          <Board chess={chess} boardVerision={boardVerision} socket={socket} />
        </div>
        <div className="font-mono text-green-800">
          Details
          <p>
            status:
            <strong className="text-green-500 text-shadow-md text-shadow-green-300/10">
              {" "}
              {game.status}
            </strong>
          </p>
          <p>
            you:
            <strong className="text-green-500 text-shadow-md text-shadow-green-300/10">
              {" "}
              {game.you === "w" ? "white" : "black"}
            </strong>
          </p>
          <p>
            turn:
            <strong className="text-green-500 text-shadow-md text-shadow-green-300/10">
              {" "}
              {game.turn === "w" ? "white" : "black"}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Game;
