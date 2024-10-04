import ChatIcon from "@mui/icons-material/Chat";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";

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

export default function Root() {
  const location = useLocation();
  const [tabIndex, setTabIndex] = useState(0);

  //TODO 元々はどこでリロードしてもheaderがhomeになっていた。それを解消するために以下のコードを追加した。しかし、微妙だと思うので、より良い方法を求む。
  useEffect(() => {
    const currentPath = location.pathname;
    const currentIndex = paths.indexOf(currentPath);
    if (currentIndex !== -1) {
      setTabIndex(currentIndex);
    }
  }, [location.pathname]);

  return (
    <>
      <Header title={labels[tabIndex]} />
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
        <Outlet />
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
            component={Link}
            to="/home"
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
            component={Link}
            to="/friends"
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
            component={Link}
            to="/chat"
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
            component={Link}
            to="/settings"
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
