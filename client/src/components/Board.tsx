import type { Chess, Square } from "chess.js";
import type { Socket } from "socket.io-client";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";

import { GAME_OVER, MOVE } from "../App";
import BoardSquare from "./BoardSquare";
import { useGame } from "../store/game";
import { useEffect, useState } from "react";

interface BoardProps {
  chess?: Chess;
  boardVerision?: number;
  socket?: Socket | null;
}

const moveSound = new Audio("/sounds/move.wav");
const gameOver = new Audio("/sounds/game-over.mp3");

const Board = (props: BoardProps) => {
  const { chess, socket } = props;

  const { game } = useGame();

  const [blackBottom, setblackBottom] = useState(false);

  const sendMove = (from: string, to: string) => {
    socket?.emit("message", {
      type: MOVE,
      move: { from: from, to: to },
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over || !chess || !socket) return;

    const from = event.active.id as Square;
    const to = event.over.id as Square;

    if (from === to) return;

    try {
      chess.move({ from, to });

      moveSound.play();

      sendMove(from, to);
    } catch (err) {
      console.log("Illegal move", err);
    }
  };

  useEffect(() => {
    if (game.status === GAME_OVER) {
      gameOver.play();
    }

    const setBoardDetails = () => {
      if (game.you === "b") {
        setblackBottom(true);
      } else {
        setblackBottom(false);
      }
    };

    setBoardDetails();
  }, [game]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={blackBottom ? "rotate-180" : ""}>
        {chess &&
          chess.board().map((row, r) => {
            return (
              <div key={r} className="flex">
                {row.map((cell, c) => {
                  return (
                    <BoardSquare
                      key={r + c}
                      cell={cell}
                      c={c}
                      r={r}
                      blackBottom={blackBottom}
                      isAllowed={
                        game.turn === game.you && game.you === cell?.color
                      }
                    />
                  );
                })}
              </div>
            );
          })}
      </div>
    </DndContext>
  );
};

export default Board;
