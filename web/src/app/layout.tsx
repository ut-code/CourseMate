"use client";
import BanLandscape from "~/components/BanLandscape";
import { AlertProvider } from "~/components/common/alert/AlertProvider";
import { ModalProvider } from "~/components/common/modal/ModalProvider";
import AuthProvider from "~/firebase/auth/AuthProvider";
import ChatIcon from "@mui/icons-material/Chat";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import Link from "next/link";
import Header from "../components/Header";
import { CssBaseline, createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { SnackbarProvider } from "notistack";
import type { Metadata } from "next";

const labels = [
  "ホーム/Home",
  "フレンド/Friends",
  "チャット/Chat",
  "設定/Settings",
  "設定/Settings",
  "設定/Settings",
  "設定/Settings",
  "設定/Settings",
  "編集/Edit",
  "編集/Edit",
];

const paths = [
  "/home",
  "/friends",
  "/chat",
  "/settings",
  "/settings/profile",
  "/settings/contact",
  "/settings/aboutUs",
  "/settings/disclaim",
  "/settings/delete",
  "/edit/profile",
  "/edit/courses",
];
paths[0]; // todo

export default ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <head>
      <link rel="icon" type="image/svg+xml" href="/course-mate-icon.svg" />
    </head>
    <body>
      <div id="root">
        <Providers>
          <Root>{children}</Root>
        </Providers>
      </div>
      <script type="module" src="../main.tsx" />
    </body>
  </html>
);

// TODO: export this
const metadata: Metadata = {
  title: "CourseMate",
  description: "CourseMate helps students to find friends",
};
metadata;

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

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>
        <CssBaseline />
        <AlertProvider>
          <ModalProvider>
            <BanLandscape />
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SnackbarProvider
                autoHideDuration={2000}
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
              >
                {children}
              </SnackbarProvider>
            </ThemeProvider>
          </ModalProvider>
        </AlertProvider>
      </AuthProvider>
    </>
  );
}

function Root({ children }: { children: React.ReactNode }) {
  // const location = useLocation();
  // const [tabIndex, setTabIndex] = useState(0);

  // //TODO: この処理の遅さが気になる場合は、Header は 各コンポーネントから呼ぶことにしてもよい
  // useEffect(() => {
  //   const currentPath = `/${location.pathname.split("/")[1]}`;
  //   const currentIndex = paths.indexOf(currentPath);
  //   if (currentIndex !== -1) {
  //     setTabIndex(currentIndex);
  //   }
  // }, [location.pathname]);

  // TODO: fix tabindex
  const tabIndex = 0 as number;
  const setTabIndex = (..._args: unknown[]) => {};
  return (
    <>
      <Header title={labels[tabIndex]} />
      <Box
        sx={{
          position: "absolute",
          top: {
            xs: "56px",
            sm: "64px",
          },
          bottom: "56px",
          left: 0,
          right: 0,
          overflowY: "auto",
        }}
      >
        {children}
      </Box>
      <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
        <BottomNavigation
          showLabels
          value={tabIndex}
          onChange={(_event, newValue) => {
            setTabIndex(newValue);
          }}
          sx={{
            width: "100%",
            bottom: 0,
            borderTop: "1px solid",
            borderColor: "primary.main",
          }}
        >
          <BottomNavigationAction
            LinkComponent={Link}
            href="/home"
            label="Home"
            icon={
              <HomeIcon
                sx={{
                  color: tabIndex === 0 ? "primary.main" : "secondary.main",
                }}
              />
            }
          />
          <BottomNavigationAction
            LinkComponent={Link}
            href="/home"
            label="Friends"
            icon={
              <PeopleIcon
                sx={{
                  color: tabIndex === 1 ? "primary.main" : "secondary.main",
                }}
              />
            }
          />
          <BottomNavigationAction
            LinkComponent={Link}
            href="/home"
            label="Chat"
            icon={
              <ChatIcon
                sx={{
                  color: tabIndex === 2 ? "primary.main" : "secondary.main",
                }}
              />
            }
          />
          <BottomNavigationAction
            LinkComponent={Link}
            href="/home"
            label="Settings"
            icon={
              <SettingsIcon
                sx={{
                  color: tabIndex === 3 ? "primary.main" : "secondary.main",
                }}
              />
            }
          />
        </BottomNavigation>
      </Box>
    </>
  );
}
