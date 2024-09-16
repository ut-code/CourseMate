import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";

const labels = [
  "ホーム/Home",
  "フレンド/Friends",
  "チャット/Chat",
  "設定/Settings",
];
const paths = ["/home", "/friends", "/chat", "/settings"];

export default function Root() {
  const location = useLocation();
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
      <div
        style={{
          boxShadow: "2px 2px 4px -2px gray inset",
          zIndex: 1000,
          position: "relative",
        }}
      >
        <Header title={labels[value]} />
      </div>
      <div>
        <Outlet />
      </div>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          width: "100%",
          position: "fixed",
          bottom: 0,
          borderTop: "1px solid #039BE5",
        }}
      >
        <BottomNavigationAction
          component={Link}
          to="/home"
          label="Home"
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to="/friends"
          label="Friends"
          icon={<PeopleIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to="/chat"
          label="Chat"
          icon={<ChatIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to="/settings"
          label="Settings"
          icon={<SettingsIcon />}
        />
      </BottomNavigation>
    </>
  );
}
