import { ArrowBack } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import hooks from "../../../api/hooks";
import { Card } from "../../../components/Card";
import FullScreenCircularProgress from "../../../components/common/FullScreenCircularProgress";

export default function Profile() {
  const { state } = hooks.useMe();
  const data = state.data;
  const navigate = useNavigate();
  const error = state.current === "error" ? state.error : null;
  const loading = state.current === "loading";
  const [back, setBack] = useState<boolean>(false);

  if (loading) {
    return <FullScreenCircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (!data) {
    return <Typography>データがありません。</Typography>;
  }

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
      <IconButton
        sx={{ position: "absolute", top: "20px", left: "20px" }}
        onClick={() => navigate("/settings")}
      >
        <ArrowBack />
      </IconButton>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "75%",
          maxWidth: "500px",
          marginBottom: "20px",
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
    </Box>
  );
}
