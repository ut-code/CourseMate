import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import PeopleIcon from "@mui/icons-material/People";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function Root() {
  const [value, setValue] = useState(0);
  const labels = ["Home", "Profile", "Followers", "Requests"];

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {labels[value]}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
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
        <BottomNavigationAction component={Link} to="/home" label="Home" icon={<HomeIcon />} />
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
