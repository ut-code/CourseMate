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

export default function Root() {
  const location = useLocation();
  const [tabIndex, setTabIndex] = useState(0);

  //TODO: この処理の遅さが気になる場合は、Header は 各コンポーネントから呼ぶことにしてもよい
  useEffect(() => {
    const currentPath = `/${location.pathname.split("/")[1]}`;
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
