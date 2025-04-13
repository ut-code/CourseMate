"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { SnackbarProvider } from "notistack";
import React from "react";
import type { ReactNode } from "react";
import BanLandscape from "~/components/BanLandscape";
import SSEProvider from "~/components/SSEProvider";
import { AlertProvider } from "~/components/common/alert/AlertProvider";

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

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        autoHideDuration={2000}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <React.StrictMode>
          <CssBaseline />
          <AlertProvider>
            {/* <ModalProvider> */}
            <BanLandscape />
            <SSEProvider>{children}</SSEProvider>
            {/* </ModalProvider> */}
          </AlertProvider>
        </React.StrictMode>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
