import { Outlet } from 'react-router';
import { useSocket } from './hooks/useSocket';
import { useSocketStore } from './store/socket';
import { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import useUser from './store/user';
import useApiPrivate from './hooks/useAxiosPrivate';
import AppSidebar from './components/SideBar';

// import Stockfish from "./engine/stockfish.worker.js";

export const ERROR = 'error';
export const INQUEUE = 'inqueue';
export const INIT_GAME = 'init_game';
export const MOVE = 'move';
export const TIME_OUT = 'time_out';
export const EXIT_GAME = 'exit_game';
export const GAME_OVER = 'game_over';
export const RESIGN = 'resign';
export const CHAT = 'chat';
export const PLAYER_LEFT = 'player_left';

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
      try {
        const userInfo = await api
          .get('/auth/getuser', { withCredentials: true })
          .then((res) => res.data);

        if (userInfo?.user?.email) {
          loginUser({
            name: userInfo.user.name,
            email: userInfo.user.email,
            avatar: userInfo.user.avatar,
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        /* empty */
      }
    };

    getUserInfo().finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-background text-white">
        Loading...
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="relative h-screen lg:overflow-hidden text-white bg-linear-to-t from-background to-[#121212]">
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <SidebarTrigger className="size-10 m-2" />
            <Outlet />
          </main>
        </SidebarProvider>
      </div>
      <Toaster richColors />
    </GoogleOAuthProvider>
  );
}

export default App;
