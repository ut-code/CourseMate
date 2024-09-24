import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import App from "./App";
import BanLandscape from "./components/BanLandscape";
import { AlertProvider } from "./components/common/alert/AlertProvider";
import { ModalProvider } from "./components/common/modal/ModalProvider";
import AuthProvider from "./firebase/auth/AuthProvider";

const root = document.getElementById("root");
if (!root) throw "couldn't find root!";
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AuthProvider>
      <CssBaseline />
      <AlertProvider>
        <ModalProvider>
          <BanLandscape />
          <App />
        </ModalProvider>
      </AlertProvider>
    </AuthProvider>
  </React.StrictMode>,
);
