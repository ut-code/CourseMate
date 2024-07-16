import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import PeopleIcon from "@mui/icons-material/People";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function Root() {
  const [value, setValue] = useState(0);
  const labels = ["Home", "Profile", "Followers", "Requests"];

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
