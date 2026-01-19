import { Chess, type Move, type Square } from 'chess.js';
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

import BoardSquare from './BoardSquare';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BoardProps {
  chess?: Chess;
  position?: string;
  yourColor?: 'b' | 'w';
  staticBoard?: boolean;
  blackBottom?: boolean;
  onDragStart?: (from: Square) => void;
  onDragEnd?: (from: Square, to: Square) => void;
  className?: string;
  animate?: boolean;
}

const Board = (props: BoardProps) => {
  const {
    chess: chessInstance,
    position,
    yourColor,
    staticBoard,
    blackBottom = false,
    onDragStart: onDragStartProp,
    onDragEnd: onDragEndProp,
    className,
    animate = false,
  } = props;

  const chess = chessInstance || new Chess(position || undefined);

  const [valideMoves, setValideMoves] = useState<Move[]>([]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (staticBoard) return;

    if (!event.over || !chess) return;

    const from = event.active.id as Square;
    const to = event.over.id as Square;

    if (from === to) return;

    if (onDragEndProp) {
      onDragEndProp?.(from, to);
    }

    try {
      chess.move({ from, to });
    } catch (err) {
      console.log('Illegal move', err);
    }
    setValideMoves([]);
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (staticBoard) return;

    if (!chess) return;

    const from = event.active.id as Square;

    if (onDragStartProp) {
      onDragStartProp?.(from);
    }

    const moves = chess.moves({ square: from, verbose: true });

    setValideMoves(moves);
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div
        className={cn(
          'aspect-square grid grid-rows-8 opacity-90',
          className,
          blackBottom ? 'rotate-180' : ''
        )}
      >
        {chess &&
          chess.board().map((row, r) => {
            return (
              <div key={r} className="grid grid-cols-8">
                {row.map((cell, c) => {
                  return (
                    <BoardSquare
                      delay={animate ? (r + c) * 100 : 0}
                      key={r + c}
                      cell={cell}
                      c={c}
                      r={r}
                      blackBottom={blackBottom}
                      valideMoves={valideMoves}
                      isAllowed={
                        chess.turn() === yourColor && yourColor === cell?.color
                      }
                      animate={animate}
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
