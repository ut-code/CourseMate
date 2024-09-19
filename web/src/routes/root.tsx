import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";

const labels = ["Home", "Friends", "Chat", "Profile"];
const paths = ["/home", "/friends", "/chat", "/profile"];

export default function Root() {
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
      <div style={{ marginBottom: "56px" }}>
        <Outlet />
      </div>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_event, newValue) => {
          setValue(newValue);
        }}
        sx={{ width: "100%", position: "fixed", bottom: 0 }}
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
          to="/profile"
          label="Profile"
          icon={<AccountCircleIcon />}
        />
      </BottomNavigation>
    </>
  );
}
