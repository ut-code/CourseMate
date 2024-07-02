import { Box } from "@mui/material";
import { User } from "../../../../common/types";

export default function Profile() {
  // TODO: Implement this
  // const user = useAuthContext();
  const SAMPLE_USER: User = {
    id: 1,
    uid: "hogehoge",
    name: "ほげ",
    email: "hoge@example.com",
  };

  return (
    <Box>
      <p>Name: {SAMPLE_USER.name}</p>
      <p>ID: {SAMPLE_USER.id}</p>
    </Box>
  );
}
