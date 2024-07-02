import React from "react";
<script src="http://localhost:8097"></script>;
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./app/App";
import Home from "./app/tabs/home";
import Profile from "./app/tabs/profile";
import Followers from "./app/tabs/followers";
import Requests from "./app/tabs/requests";

import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import Login from "./utils/logIn/logIn";
import SignUpPage from "./utils/signUp/signUpPage";
import AuthPage from "./pages/authPage";
import { AuthProvider } from "./provider/AuthProvider";
import App from "./app/App";

const router = createBrowserRouter([
  {
    path: "/main",
    element: <App />,
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
    path: "/logIn",
    element: <Login />,
  },
  {
    path: "/signUp",
    element: <SignUpPage />,
  },
  {
    path: "/",
    element: <AuthPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />

    </AuthProvider>
  </React.StrictMode>
);
