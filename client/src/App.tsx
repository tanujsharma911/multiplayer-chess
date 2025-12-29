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
    <div className="bg-gray-800 flex flex-col items-center h-screen text-white">
      <div className="h-full">
        <Outlet />
      </div>
      <div className="absolute bottom-0 p-2 text-center text-sm text-gray-400">
        Made by{" "}
        <a href="https://github.com/tanujsharma911" className="underline">
          Tanuj Sharma
        </a>
      </div>
    </div>
  );
}

export default App;
