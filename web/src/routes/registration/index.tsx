import { Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { EditUserBox } from "../../components/config/EditUserBox";
import { register } from "./functions";
import { useState } from "react";

export default function RegistrationPage() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);

  return (
    <Box>
      <Header title="Sign Up" />
      <EditUserBox
        save={(data) => register(data, { navigate, enqueueSnackbar })}
        saveButtonText="登録"
        allowClose={false}
      />
    </Box>
  );
}
