"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { SnackbarProvider } from "notistack";
import React from "react";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import BanLandscape from "../components/BanLandscape";
import { AlertProvider } from "../components/common/alert/AlertProvider";
import { ModalProvider } from "../components/common/modal/ModalProvider";
import AuthProvider from "../firebase/auth/AuthProvider";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/course-mate-icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CourseMate</title>
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            autoHideDuration={2000}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
          >
            <React.StrictMode>
              <AuthProvider>
                <CssBaseline />
                <AlertProvider>
                  <ModalProvider>
                    <BanLandscape />
                    {children}
                  </ModalProvider>
                </AlertProvider>
              </AuthProvider>
            </React.StrictMode>
          </SnackbarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
