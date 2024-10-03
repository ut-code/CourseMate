import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import hooks from "../../api/hooks";
import { Card } from "../../components/Card";
import LogOutButton from "../../components/LogOutButton";
import FullScreenCircularProgress from "../../components/common/FullScreenCircularProgress";

export default function Settings() {
  console.log("Settings: rendering...");
  const navigate = useNavigate();
  const { state } = hooks.useMe();
  const data = state.data;
  const error = state.current === "error" ? state.error : null;
  const loading = state.current === "loading";

  const [back, setBack] = useState<boolean>(false);

  return (
    <Box
      sx={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {loading ? (
        <FullScreenCircularProgress />
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : data ? (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "75%",
              maxWidth: "500px",
            }}
          >
            <Typography variant="h6" component="h1" sx={{ marginRight: 1 }}>
              あなたのカード
            </Typography>
            <IconButton
              onClick={() => navigate(back ? "/edit/courses" : "/edit/profile")}
            >
              <EditIcon sx={{ color: "#039BE5" }} fontSize="large" />{" "}
            </IconButton>
          </Box>
          <Card displayedUser={data} onFlip={(back) => setBack(back)} />
          <LogOutButton />
        </>
      ) : (
        <p>データがありません。</p>
      )}
    </Box>
  );
}
