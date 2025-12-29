import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "./index.css";

import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import Game from "./pages/Game.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/game",
        element: <Game />,
      },
      // {
      //   path: "/login",
      //   element: (
      //     <AuthLayout authRequired={false}>
      //       <Login />
      //     </AuthLayout>
      //   ),
      // },
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
      // {
      //   path: "/account",
      //   element: (
      //     <AuthLayout authRequired>
      //       <Account />
      //     </AuthLayout>
      //   ),
      // },
      // {
      //   path: "/watch",
      //   element: (
      //     <AuthLayout>
      //       <Video />
      //     </AuthLayout>
      //   ),
      // },
      // {
      //   path: "/not-found",
      //   element: <NotFound />,
      // },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
