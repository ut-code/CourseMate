"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { SnackbarProvider } from "notistack";
import React from "react";
import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import BanLandscape from "~/components/BanLandscape";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/course-mate-icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CourseMate</title>
      </head>
      <body className="h-full">
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
                {children}
                {/* </ModalProvider> */}
              </AlertProvider>
            </React.StrictMode>
          </SnackbarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
