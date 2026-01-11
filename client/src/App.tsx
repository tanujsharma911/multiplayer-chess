import { Outlet } from "react-router";
import { useSocket } from "./hooks/useSocket";
import { useSocketStore } from "./store/socket";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import useUser from "./store/user";
import useApiPrivate from "./hooks/useAxiosPrivate";

// import Stockfish from "./engine/stockfish.worker.js";

export const ERROR = "error";
export const INQUEUE = "inqueue";
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const TIME_OUT = "time_out";
export const EXIT_GAME = "exit_game";
export const GAME_OVER = "game_over";
export const RESIGN = "resign";
export const CHAT = "chat";

function App() {
  const socket = useSocket();
  const api = useApiPrivate();

  const { setSocket } = useSocketStore();
  const { loginUser, user } = useUser();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!socket) return;

    setSocket(socket);
  }, [socket, setSocket]);

  useEffect(() => {
    if (user.isLoggedIn) return;

    const getUserInfo = async () => {
      const userInfo = await api.get("/auth/getuser").then((res) => res.data);

      if (userInfo?.user?.email) {
        loginUser({
          name: userInfo.user.name,
          email: userInfo.user.email,
          avatar: userInfo.user.avatar,
        });
      }
    };

    getUserInfo().finally(() => setIsLoading(false));
  }, []);

  if (!user || isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="bg-gray-900 min-h-screen grid grid-rows-[auto_1fr_auto] lg:overflow-hidden text-white">
        <Navbar />

        <div className="relative grid grid-rows-1 grid-cols-1 overflow-hidden">
          <Outlet />
        </div>

        <div className="text-center border- text-xs text-gray-500">
          Made by{" "}
          <a href="https://github.com/tanujsharma911" className="underline">
            Tanuj Sharma
          </a>
        </div>
      </div>
      <Toaster richColors />
    </GoogleOAuthProvider>
  );
}

export default App;
