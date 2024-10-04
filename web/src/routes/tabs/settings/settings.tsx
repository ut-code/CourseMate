import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogOutButton from "../../../components/LogOutButton";

export default function Settings() {
  console.log("Settings: rendering...");
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <List sx={{ width: "100%" }}>
        <ListItemButton onClick={() => navigate("/settings/profile")}>
          <ListItemText primary="あなたのカード" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => navigate("/settings/contact")}>
          <ListItemText primary="お問い合わせ" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => navigate("/settings/aboutUs")}>
          <ListItemText primary="About Us" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => navigate("/settings/disclaimer")}>
          <ListItemText primary="免責事項" />
        </ListItemButton>
        <Divider />
        <LogOutButton />
        <Divider />
      </List>
    </Box>
  );
}
