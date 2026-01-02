import type { PieceSymbol } from "chess.js";
import type { HTMLAttributes } from "react";
import DraggablePiece from "./DraggablePiece";

interface PieceProps extends HTMLAttributes<HTMLDivElement> {
  type: PieceSymbol;
  isAllowed?: boolean;
  squareId: string;
  blackBottom?: boolean;
}

const Piece = (props: PieceProps) => {
  const { type, squareId, blackBottom, ...rest } = props;

  return (
    <DraggablePiece blackBottom={blackBottom} id={squareId} {...rest}>
      <img
        src={`pieces/${type}.png`}
        className={`bg-transparent ${blackBottom ? "rotate-180" : ""}`}
        style={{
          touchAction: "none", // prevent zooming and scrolling on touch devices
        }}
      ></img>
    </DraggablePiece>
  );
};

export default Piece;
