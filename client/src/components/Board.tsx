import type { Chess, Square } from "chess.js";
import { useState } from "react";
import type { Socket } from "socket.io-client";
import { MOVE } from "../App";
import Piece from "../components/Piece";

interface BoardProps {
  chess?: Chess;
  boardVerision?: number;
  socket?: Socket | null;
}

const Board = (props: BoardProps) => {
  const { chess, boardVerision, socket } = props;

  const [from, setFrom] = useState<Square | null>(null);

  const handleOnClick = (coord: Square) => {
    if (!socket) {
      alert("no socket");
      return;
    }

    if (!from) {
      setFrom(coord);
    } else if (from === coord) {
      setFrom(null);
    } else {
      try {
        chess?.move({ from: from, to: coord });

        socket?.emit("message", {
          type: MOVE,
          move: { from: from, to: coord },
        });

        setFrom(null);
      } catch (error) {
        setFrom(null);
        alert("Illegal move");
        console.log("Board.tsx :: ", error);
        return;
      }
    }
  };

  return (
    <>
      <div className="aspect-square">
        {chess &&
          chess.board().map((row, r) => {
            return (
              <div key={r} className="flex">
                {row.map((cell, c) => {
                  const colIndex: string = String.fromCharCode(97 + c);
                  const rowIndex: string = 8 - r + "";
                  return (
                    <div
                      key={c + r}
                      className={`relative w-10 sm:w-12 md:w-14 lg:w-16 h-10 sm:h-12 md:h-14 lg:h-16 ${
                        (r + c) % 2 === 0
                          ? "bg-gray-300 text-gray-400"
                          : "bg-gray-400 text-gray-300"
                      }`}
                      onClick={() =>
                        handleOnClick((colIndex + rowIndex) as Square)
                      }
                    >
                      {/* Coordinates */}
                      <div className="absolute inset-0 flex flex-col justify-between">
                        <span className="text-sm px-1 font-semibold">
                          {c === 0 && rowIndex}
                        </span>
                        <span className="text-sm px-1 w-full text-right font-semibold">
                          {1 === 8 - r && colIndex}
                        </span>
                      </div>

                      {/* Piece */}
                      <div
                        className={`absolute inset-0 grid place-items-center text-bold text-2xl text-${
                          cell?.color === "b" ? "black" : "white"
                        }`}
                      >
                        {cell?.type && (
                          <Piece
                            type={cell?.color + cell?.type.toLocaleUpperCase()}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
      <p className="text-gray-500">from: {from}</p>
    </>
  );
};

export default Board;
