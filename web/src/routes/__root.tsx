import ChatIcon from "@mui/icons-material/Chat";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import {
  Link,
  Outlet,
  createRootRoute,
  useLocation,
} from "@tanstack/react-router";
import { type ReactElement, useEffect, useState } from "react";
import Header from "../components/Header";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

// this is copied from tanstack get started.
// todo: edit this to match our app
const labels = [
  "ホーム/Home",
  "フレンド/Friends",
  "チャット/Chat",
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
  "/edit/profile",
  "/edit/courses",
];

export const Route = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});
export function Layout({ children }: { children: ReactElement }) {
  const location = useLocation();
  // what the f*ck is value, everything is either a value or a stmt huh?
  // (at least this variable is not a stmt)
  const [value, setValue] = useState(0);

  //TODO 元々はどこでリロードしてもheaderがhomeになっていた。それを解消するために以下のコードを追加した。しかし、微妙だと思うので、より良い方法を求む。
  useEffect(() => {
    const currentPath = location.pathname;
    const currentIndex = paths.indexOf(currentPath);
    if (currentIndex !== -1) {
      setValue(currentIndex);
    }
  }, [location.pathname]);

  return (
    <>
      <Header title={labels[value]} />
      <Box
        sx={{
          position: "absolute",
          top: "56px",
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
          value={value}
          onChange={(_event, newValue) => {
            setValue(newValue);
          }}
          sx={{
            width: "100%",
            bottom: 0,
            borderTop: "1px solid",
            borderColor: "primary.main",
          }}
        >
          <BottomNavigationAction
            component={Link}
            to="/home"
            label="Home"
            icon={
              <HomeIcon
                sx={{ color: value === 0 ? "primary.main" : "secondary.main" }}
              />
            }
          />
          <BottomNavigationAction
            component={Link}
            to="/friends"
            label="Friends"
            icon={
              <PeopleIcon
                sx={{ color: value === 1 ? "primary.main" : "secondary.main" }}
              />
            }
          />
          <BottomNavigationAction
            component={Link}
            to="/chat"
            label="Chat"
            icon={
              <ChatIcon
                sx={{ color: value === 2 ? "primary.main" : "secondary.main" }}
              />
            }
          />
          <BottomNavigationAction
            component={Link}
            to="/settings"
            label="Settings"
            icon={
              <SettingsIcon
                sx={{ color: value === 3 ? "primary.main" : "secondary.main" }}
              />
            }
          />
        </BottomNavigation>
      </Box>
    </>
  );
}
