import { useDroppable } from '@dnd-kit/core';
import type { Color, Move, PieceSymbol, Square } from 'chess.js';
import Piece from './Piece';
import { cn } from '@/lib/utils';

interface SquareProps {
  delay: number;
  cell: { square: Square; type: PieceSymbol; color: Color } | null;
  r: number;
  c: number;
  isAllowed?: boolean;
  blackBottom?: boolean;
  valideMoves?: Move[];
  animate?: boolean;
}

const BoardSquare = (props: SquareProps) => {
  const { delay, cell, isAllowed, r, c, blackBottom, valideMoves, animate } =
    props;

  const colIndex: string = String.fromCharCode(97 + c);
  const rowIndex: string = 8 - r + '';

  const squareId = (colIndex + rowIndex) as Square;

  const { setNodeRef } = useDroppable({
    id: squareId,
  });

  return (
    <div
      key={c + r}
      ref={setNodeRef}
      className={cn(
        `relative aspect-square ${
          (r + c) % 2 === 0
            ? 'bg-gray-300 text-gray-400'
            : 'bg-gray-400 text-gray-300'
        }`,
        animate
          ? 'motion-scale-in-0 motion-ease-out motion-opacity-in-0 motion-blur-in-sm'
          : ''
      )}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Coordinates */}
      <div
        className={`absolute inset-0 flex flex-col justify-between ${
          blackBottom ? 'flex-col-reverse' : ''
        }`}
      >
        <span
          className={`text-sm px-1 w-full font-semibold ${
            blackBottom ? 'rotate-180 text-left' : ''
          }`}
        >
          {blackBottom ? c === 7 && rowIndex : c === 0 && rowIndex}
        </span>
        <span
          className={`text-sm px-1 w-full font-semibold text-right ${
            blackBottom ? 'rotate-180' : ''
          }`}
        >
          {blackBottom ? 8 === 8 - r && colIndex : 1 === 8 - r && colIndex}
        </span>
      </div>

      {/* Valid Move Dot */}
      <div className="absolute inset-0 grid place-items-center">
        {valideMoves?.some((move) => move.to === squareId) && (
          <div className="w-4 h-4 rounded-full bg-gray-500/70"></div>
        )}
      </div>

      {/* Piece */}
      <div
        className={`absolute inset-0 grid place-items-center text-bold text-2xl text-${
          cell?.color === 'b' ? 'black' : 'white'
        }`}
      >
        {cell?.type && (
          <Piece
            delay={delay}
            animate={animate}
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
