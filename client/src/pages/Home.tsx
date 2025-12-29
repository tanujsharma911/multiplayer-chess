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
      <h1 className="text-4xl font-bold mb-5">Play Chess on #1 Site</h1>
      <button
        className="bg-blue-500 font-bold flex items-center gap-2 text-shadow-md px-5 py-2 border-blue-300 border-2 rounded-md shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 inset-shadow-sm inset-shadow-blue-700"
        onClick={handleOnClick}
      >
        <ChessKnight />
        Play with Random
      </button>
    </div>
  );
};

export default Home;
