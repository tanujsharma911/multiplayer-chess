import { Chess, type Move, type Square } from "chess.js";
import type { Socket } from "socket.io-client";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import { MOVE } from "../App";
import BoardSquare from "./BoardSquare";
import { useGame } from "../store/game";
import { useEffect, useState } from "react";

interface BoardProps {
  chess?: Chess;
  boardVerision?: number;
  socket?: Socket | null;
  isAnalysis?: boolean;
  position?: string | null;
}

const Board = (props: BoardProps) => {
  const { chess: chessInstance, socket, isAnalysis, position } = props;

  const { game } = useGame();
  const chess = chessInstance || new Chess(position || undefined);

  const [blackBottom, setblackBottom] = useState(false);
  const [valideMoves, setValideMoves] = useState<Move[]>([]);

  const sendMove = (from: string, to: string) => {
    if (isAnalysis) return;

    socket?.emit("message", {
      type: MOVE,
      move: { from: from, to: to },
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (isAnalysis) return;

    if (!event.over || !chess || !socket) return;

    const from = event.active.id as Square;
    const to = event.over.id as Square;

    if (from === to) return;

    try {
      chess.move({ from, to });

      sendMove(from, to);
    } catch (err) {
      console.log("Illegal move", err);
    }
    setValideMoves([]);
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (isAnalysis) return;

    if (!chess || !socket) return;

    const from = event.active.id as Square;

    const moves = chess.moves({ square: from, verbose: true });

    setValideMoves(moves);
  };

  useEffect(() => {
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
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
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
                      valideMoves={valideMoves}
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
