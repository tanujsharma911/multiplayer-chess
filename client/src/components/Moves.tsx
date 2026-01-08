import type { MoveType } from "@/pages/Game";

const Moves = ({ moves }: { moves: MoveType[] }) => {
  return (
    <div className="grid grid-cols-2 place-content-start overflow-scroll">
      {moves.map((move, index) => (
        <div key={index} className="flex h-fit gap-6 py-1 px-2 rounded">
          <div className="text-gray-500">
            {index % 2 === 0 && index / 2 + 1 + "."}
          </div>
          <div>{move.san}</div>
        </div>
      ))}

      {moves.length === 0 && (
        <div className="text-center text-gray-500 col-span-2 mt-4">
          No moves yet
        </div>
      )}
    </div>
  );
};

export default Moves;
