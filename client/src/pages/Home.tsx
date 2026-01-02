import { ChessKnight } from "lucide-react";
import { useNavigate } from "react-router";
import { useSocketStore } from "../store/socket";

const Home = () => {
  const navigate = useNavigate();
  const { socket } = useSocketStore();

  const handleOnClick = () => {
    if (!socket) {
      console.log("No socket found");
      return;
    }
    navigate("/game");
  };

  return (
    <div className="flex flex-col items-center h-full justify-center gap-4">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="grid h-full place-items-center">
          <img
            className="opacity-0 rotate-18 blur-2xl motion-translate-x-out-[32rem] motion-translate-y-out-[8rem] motion-blur-out-xs motion-opacity-out-100 motion-duration-2000 motion-ease-[cubic-bezier(0,1.04,0,1)]"
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Chess%20Pawn.png"
            alt="Chess Pawn"
            width="400"
            height="400"
          />

          <img
            className="absolute opacity-0 rotate-30 blur-2xl -motion-translate-x-out-[30rem] -motion-translate-y-out-[15rem] motion-blur-out-xs motion-opacity-out-80 motion-duration-2000 motion-ease-[cubic-bezier(0,1.04,0,1)]"
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Puzzle%20Piece.png"
            alt="Puzzle Piece"
            width="300"
            height="300"
          />
        </div>
      </div>

      {/* UI */}
      <h1 className="text-5xl text-shadow-[0_0_20px_#446dbe3e] text-blue-200 font-bold motion-opacity-in-0 motion-blur-in-0 motion-translate-y-in-100 ">
        Play Chess
      </h1>
      <h1 className="text-6xl text-shadow-[0_0_20px_#446dbe7d] text-blue-100 font-bold mb-5 motion-opacity-in-0 motion-blur-in-0 motion-translate-y-in-50 motion-delay-100">
        On #1 Online Platform
      </h1>
      <button
        className="bg-purple-500 font-bold flex items-center motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md gap-2 text-shadow-md px-5 py-2 border-purple-300 border-2 rounded-md shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 inset-shadow-sm inset-shadow-purple-700"
        onClick={handleOnClick}
      >
        <ChessKnight />
        Play Now
      </button>
    </div>
  );
};

export default Home;
