import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import Home from "./routes/tabs/home";
import Profile from "./routes/tabs/profile";
import Followers from "./routes/tabs/followers";
import Requests from "./routes/tabs/requests";

import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import Login from "./routes/login";
import SignUp from "./routes/signUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <p>Sorry, an unexpected error has occurred.</p>,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "followers",
        element: <Followers />,
      },
      {
        path: "requests",
        element: <Requests />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CssBaseline />
    <RouterProvider router={router} />
  </React.StrictMode>
);
