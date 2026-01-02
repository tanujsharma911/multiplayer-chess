import { Chess } from "chess.js";
import Board from "../components/Board";
import { useSocketStore } from "../store/socket";
import { useEffect, useState } from "react";
import { INIT_GAME, INQUEUE, MOVE } from "../App";
import { useGame } from "../store/game";

type messageType = {
  type: string;
  payload: {
    board: string;
    turn: "w" | "b";
    move: MoveType;
  };
};

interface MoveType {
  after?: string;
  before?: string;
  color?: string;
  from?: string;
  to?: string;
  lan?: string;
  san?: string;
  piece?: string;
}

const moveSound = new Audio("/sounds/move.wav");
const gameOver = new Audio("/sounds/game-end.mp3");

const Game = () => {
  const { socket } = useSocketStore();

  const [chess, setChess] = useState(new Chess());
  const [moves, setMoves] = useState<MoveType[]>([]);
  const [boardVerision, setBoardVerision] = useState(0);
  // const [openingComment, setOpeningComment] = useState("");

  const { game, setTurn } = useGame();

  useEffect(() => {
    if (!socket) return undefined;
    socket.emit("message", { type: INIT_GAME });

    const handler = (msg: messageType) => {
      if (msg.type === MOVE) {
        const newChess = new Chess(msg.payload.board);

        if (chess.isGameOver()) {
          gameOver.play();
        } else {
          moveSound.play();
        }

        setBoardVerision((v) => v + 1);

        setMoves((prev) => [...prev, msg.payload.move]);

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
    <div className="h-full mt-4">
      <div className="mx-auto max-w-5xl gap-5 grid grid-cols-1 lg:grid-cols-[auto_1fr]">
        {/* Board */}
        <div className="flex flex-col gap-2">
          {game.status === INQUEUE ? (
            <div className="flex items-center mb-2 gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-600 animate-pulse" />

              <div className="flex-1 h-4 bg-gray-600 animate-pulse rounded" />
            </div>
          ) : (
            <div className="flex items-center mb-2 gap-4">
              <img
                src="https://api.dicebear.com/9.x/thumbs/svg?seed=opponent"
                alt="opponent avatar"
                className="w-10 h-10 rounded-full"
              />
              opponent name
            </div>
          )}
          <Board chess={chess} boardVerision={boardVerision} socket={socket} />
          <div className="flex items-center mb-2 gap-4">
            <img
              src="https://api.dicebear.com/9.x/thumbs/svg?seed=you"
              alt="your avatar"
              className="w-10 h-10 rounded-full"
            />
            your name
          </div>
        </div>

        {/* Details */}
        <div className="bg-gray-800 font-mono min-w-sm p-5 rounded-xl">
          Details
          <p>you: {game.you}</p>
          <p>turn: {game.turn}</p>
          <p>status: {game.status}</p>
          <div className="grid max-h-100 grid-cols-2 overflow-y-scroll">
            {moves.map((move, index) => (
              <div
                key={index}
                className="flex items-center gap-6 py-1 px-2 rounded"
              >
                <div className="text-gray-500">
                  {index % 2 === 0 && index / 2 + 1 + "."}
                </div>
                <div>{move.san}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
