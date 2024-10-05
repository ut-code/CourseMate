import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { createLazyFileRoute } from "@tanstack/react-router";
import DeleteAccountButton from "../../components/DeleteAccountButton";
import LogOutButton from "../../components/LogOutButton";

export const Route = createLazyFileRoute("/settings/")({
  component: IndexPage,
});
function IndexPage() {
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
        <ListItemButton onClick={() => navigate({ to: "/settings/profile" })}>
          <ListItemText primary="あなたのカード" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => navigate({ to: "/settings/contact" })}>
          <ListItemText primary="お問い合わせ" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => navigate({ to: "/settings/about-us" })}>
          <ListItemText primary="About Us" />
        </ListItemButton>
        <Divider />
        <ListItemButton
          onClick={() => navigate({ to: "/settings/disclaimer" })}
        >
          <ListItemText primary="免責事項" />
        </ListItemButton>
        <Divider />
        <LogOutButton />
        <Divider />
        <DeleteAccountButton />
        <Divider />
      </List>
    </Box>
  );
}
