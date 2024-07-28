import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import PeopleIcon from "@mui/icons-material/People";
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";

const labels = ["Home", "Profile", "Followers", "Requests"];
const paths = ["/home", "/profile", "/followers", "/requests"];

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
      <Header title={labels[value]} />
      <div>
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
          to="/profile"
          label="Profile"
          icon={<AccountCircleIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to="/followers"
          label="Followers"
          icon={<PeopleIcon />}
        />
        <BottomNavigationAction
          component={Link}
          to="/requests"
          label="Requests"
          icon={<EmailIcon />}
        />
      </BottomNavigation>
    </>
  );
}
