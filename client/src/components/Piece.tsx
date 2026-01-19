import type { PieceSymbol } from 'chess.js';
import type { HTMLAttributes } from 'react';
import DraggablePiece from './DraggablePiece';
import { cn } from '@/lib/utils';

interface PieceProps extends HTMLAttributes<HTMLDivElement> {
  delay: number;
  type: PieceSymbol;
  isAllowed?: boolean;
  squareId: string;
  blackBottom?: boolean;
  animate?: boolean;
}

const Piece = (props: PieceProps) => {
  const { delay, type, squareId, blackBottom, animate, ...rest } = props;

  return (
    <DraggablePiece blackBottom={blackBottom} id={squareId} {...rest}>
      <img
        src={`/pieces/${type}.png`}
        alt={type}
        className={cn(
          `bg-transparent ${blackBottom ? 'rotate-180' : ''}`,
          animate && 'motion-scale-in-0'
        )}
        style={{
          touchAction: 'none', // prevent zooming and scrolling on touch devices
          animationDelay: `${delay}ms`, // Custom delay for stagger effect
        }}
      ></img>
    </DraggablePiece>
  );
};

export default Piece;
