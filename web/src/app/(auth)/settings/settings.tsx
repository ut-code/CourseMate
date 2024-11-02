import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/navigation";
import LogOutButton from "../../../components/LogOutButton";

export default function Settings() {
  console.log("Settings: rendering...");
  const router = useRouter();

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
        <ListItemButton onClick={() => router.push("/settings/profile")}>
          <ListItemText primary="あなたのカード" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => router.push("/tutorial")}>
          <ListItemText primary="CourseMateの使い方" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => router.push("/settings/contact")}>
          <ListItemText primary="お問い合わせ" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => router.push("/faq")}>
          <ListItemText primary="よくある質問" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => router.push("/settings/aboutUs")}>
          <ListItemText primary="About Us" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => router.push("/settings/disclaimer")}>
          <ListItemText primary="免責事項" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => router.push("/settings/delete")}>
          <ListItemText primary="アカウント削除" />
        </ListItemButton>
        <Divider />
        <LogOutButton />
        <Divider />
      </List>
    </Box>
  );
}
