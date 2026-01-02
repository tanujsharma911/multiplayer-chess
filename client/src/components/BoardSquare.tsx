import { useDroppable } from "@dnd-kit/core";
import type { Color, PieceSymbol, Square } from "chess.js";
import Piece from "./Piece";

interface SquareProps {
  cell: { square: Square; type: PieceSymbol; color: Color } | null;
  r: number;
  c: number;
  isAllowed?: boolean;
  blackBottom?: boolean;
}

const BoardSquare = (props: SquareProps) => {
  const { cell, isAllowed, r, c, blackBottom } = props;

  const colIndex: string = String.fromCharCode(97 + c);
  const rowIndex: string = 8 - r + "";

  const squareId = (colIndex + rowIndex) as Square;

  const { setNodeRef } = useDroppable({
    id: squareId,
  });

  return (
    <div
      key={c + r}
      ref={setNodeRef}
      className={`relative w-10 sm:w-12 md:w-14 lg:w-16 h-10 sm:h-12 md:h-14 lg:h-16 ${
        (r + c) % 2 === 0
          ? "bg-gray-300 text-gray-400"
          : "bg-gray-400 text-gray-300"
      }`}
    >
      {/* Coordinates */}
      <div
        className={`absolute inset-0 flex flex-col justify-between ${
          blackBottom ? "flex-col-reverse" : ""
        }`}
      >
        <span
          className={`text-sm px-1 w-full font-semibold ${
            blackBottom ? "rotate-180 text-left" : ""
          }`}
        >
          {blackBottom ? c === 7 && rowIndex : c === 0 && rowIndex}
        </span>
        <span
          className={`text-sm px-1 w-full font-semibold text-right ${
            blackBottom ? "rotate-180" : ""
          }`}
        >
          {blackBottom ? 8 === 8 - r && colIndex : 1 === 8 - r && colIndex}
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
            blackBottom={blackBottom}
            squareId={squareId}
            isAllowed={isAllowed}
            type={(cell?.color + cell?.type.toLocaleUpperCase()) as PieceSymbol}
          />
        )}
      </div>
    </div>
  );
};

export default BoardSquare;
