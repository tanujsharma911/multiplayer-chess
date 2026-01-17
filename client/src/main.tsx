import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import './index.css';

import App from './App.tsx';
import Home from './pages/Home.tsx';
import Game from './pages/Game.tsx';
import Login from './pages/Login.tsx';
import AuthLayout from './components/AuthLayout.tsx';
import Account from './pages/Account.tsx';
import Analyse from './pages/Analyse.tsx';
import PlayWithBot from './pages/Bot.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/game/random',
        element: (
          <AuthLayout authRequired>
            <Game />
          </AuthLayout>
        ),
      },
      {
        path: '/game/bot',
        element: (
          <AuthLayout authRequired>
            <PlayWithBot />
          </AuthLayout>
        ),
      },
      {
        path: '/login',
        element: <Login />,
      },
      // {
      //   path: "/signup",
      //   element: (
      //     <AuthLayout authRequired={false}>
      //       <Signup />
      //     </AuthLayout>
      //   ),
      // },
      // {
      //   path: "/v/upload",
      //   element: (
      //     <AuthLayout authRequired>
      //       <Upload />
      //     </AuthLayout>
      //   ),
      // },
      {
        path: '/account',
        element: (
          <AuthLayout authRequired>
            <Account />
          </AuthLayout>
        ),
      },
      {
        path: '/analyse/:gameId',
        element: (
          <AuthLayout authRequired>
            <Analyse />
          </AuthLayout>
        ),
      },
      // {
      //   path: "/not-found",
      //   element: <NotFound />,
      // },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
