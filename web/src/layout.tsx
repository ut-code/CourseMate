import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";
import { SnackbarProvider } from "notistack";
import BanLandscape from "./components/BanLandscape";
import { AlertProvider } from "./components/common/alert/AlertProvider";
import { ModalProvider } from "./components/common/modal/ModalProvider";
import AuthProvider from "./firebase/auth/AuthProvider";

import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#039BE5",
    },
    secondary: {
      main: "#E9F8FF",
    },
  },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CssBaseline />
      <AlertProvider>
        <ModalProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider>
              <BanLandscape />
              {children}
            </SnackbarProvider>
          </ThemeProvider>
        </ModalProvider>
      </AlertProvider>
    </AuthProvider>
  );
}
