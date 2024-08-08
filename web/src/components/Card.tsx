import { User } from "../common/types";
import { Box } from "@mui/material";

interface CardProps {
  displayedUser: User | null;
}

export const Card = ({ displayedUser }: CardProps) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <p>Name: {displayedUser?.name}</p>
      <p>id: {displayedUser?.id}</p>
      <img
        src={displayedUser?.pictureUrl}
        alt="Profile Picture"
        style={{
          width: "300px",
          height: "300px",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
};
