import EditIcon from "@mui/icons-material/Edit";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import hooks from "../../api/hooks";
import { Card } from "../../components/Card";
import LogOutButton from "../../components/LogOutButton";

export default function Settings() {
  const navigate = useNavigate();
  const { data, loading, error } = hooks.useMe();

  function handleProfileEdit() {
    navigate("/edit/profile");
  }

  return (
    <Box
      sx={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100vh",
      }}
    >
      {loading ? (
        <CircularProgress />
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
            <Typography variant="h6" sx={{ marginRight: 1 }}>
              あなたのカード
            </Typography>
            <IconButton onClick={handleProfileEdit}>
              <EditIcon sx={{ color: "#039BE5" }} fontSize="large" />{" "}
            </IconButton>
          </Box>
          <Card displayedUser={data} />
          <LogOutButton />
        </>
      ) : (
        <p>データがありません。</p>
      )}
    </Box>
  );
}
