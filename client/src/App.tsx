import { Outlet } from "react-router";
import { useSocket } from "./hooks/useSocket";
import { useSocketStore } from "./store/socket";
import { useEffect } from "react";

export const ERROR = "error";
export const INQUEUE = "inqueue";
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

function App() {
  const socket = useSocket();

  const { setSocket } = useSocketStore();

  useEffect(() => {
    if (!socket) return;

    setSocket(socket);
  }, [socket]);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className=" bg-gray-800 flex justify-center">
        <div className="w-full max-w-5xl flex items-center gap-2 p-2">
          <p className="font-black text-xl">Chess</p>
        </div>
      </div>
      <div className="h-full w-full relative px-5">
        <Outlet />
      </div>
      <div className="p-2 text-center text-sm text-gray-400">
        Made by{" "}
        <a href="https://github.com/tanujsharma911" className="underline">
          Tanuj Sharma
        </a>
      </div>
    </div>
  );
}

export default App;
