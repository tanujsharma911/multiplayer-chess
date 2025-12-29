import React from "react";
import { defaultPieces } from "../utils/Pieces";

interface PieceProps {
  type: string;
}

const Piece = (props: PieceProps) => {
  const { type } = props;
  const PieceSvg = defaultPieces[type];
  return <div>{PieceSvg?.()}</div>;
};

export default Piece;
