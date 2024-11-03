import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import LogOutButton from "../../components/LogOutButton";
import { NavigateByAuthState } from "../../components/common/NavigateByAuthState";

export default function Settings() {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <List sx={{ width: "100%" }}>
          <ListItemButton LinkComponent={Link} href="/settings/profile">
            <ListItemText primary="あなたのカード" />
          </ListItemButton>
          <Divider />
          <ListItemButton LinkComponent={Link} href="/tutorial">
            <ListItemText primary="CourseMateの使い方" />
          </ListItemButton>
          <Divider />
          <ListItemButton LinkComponent={Link} href="/settings/contact">
            <ListItemText primary="お問い合わせ" />
          </ListItemButton>
          <Divider />
          <ListItemButton LinkComponent={Link} href="/faq">
            <ListItemText primary="よくある質問" />
          </ListItemButton>
          <Divider />
          <ListItemButton LinkComponent={Link} href="/settings/aboutUs">
            <ListItemText primary="About Us" />
          </ListItemButton>
          <Divider />
          <ListItemButton LinkComponent={Link} href="/settings/disclaimer">
            <ListItemText primary="免責事項" />
          </ListItemButton>
          <Divider />
          <ListItemButton LinkComponent={Link} href="/settings/delete">
            <ListItemText primary="アカウント削除" />
          </ListItemButton>
          <Divider />
          <LogOutButton />
          <Divider />
        </List>
      </Box>
    </NavigateByAuthState>
  );
}
