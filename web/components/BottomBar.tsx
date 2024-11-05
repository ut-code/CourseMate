import ChatIcon from "@mui/icons-material/Chat";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import Link from "next/link";

type Props = {
  activeTab: "0_home" | "1_friends" | "2_chat" | "3_settings";
};

export default function BottomBar(props: Props) {
  const { activeTab } = props;
  return (
    <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
      {/* TODO: 単に Viewer として BottomNavigation を使用しているので Box 等で置き換える */}
      <BottomNavigation
        showLabels
        value={activeTab}
        sx={{
          width: "100%",
          bottom: 0,
          borderTop: "1px solid",
          borderColor: "primary.main",
        }}
      >
        <BottomNavigationAction
          component={Link}
          href="/home"
          label="Home"
          icon={
            <HomeIcon
              sx={{
                color:
                  activeTab === "0_home" ? "primary.main" : "secondary.main",
              }}
            />
          }
        />
        <BottomNavigationAction
          component={Link}
          href="/friends"
          label="Friends"
          icon={
            <PeopleIcon
              sx={{
                color:
                  activeTab === "1_friends" ? "primary.main" : "secondary.main",
              }}
            />
          }
        />
        <BottomNavigationAction
          component={Link}
          href="/chat"
          label="Chat"
          icon={
            <ChatIcon
              sx={{
                color:
                  activeTab === "2_chat" ? "#primary.main" : "secondary.main",
              }}
            />
          }
        />
        <BottomNavigationAction
          component={Link}
          href="/settings"
          label="Settings"
          icon={
            <SettingsIcon
              sx={{
                color:
                  activeTab === "3_settings"
                    ? "primary.main"
                    : "secondary.main",
              }}
            />
          }
        />
      </BottomNavigation>
    </Box>
  );
}
