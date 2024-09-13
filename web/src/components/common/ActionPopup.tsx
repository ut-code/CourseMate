import { Box, Button } from "@mui/material";

type Action = {
  label: string;
  onClick: () => void;
  confirmMessage?: string;
};

export default function ActionPopup({ actions }: { actions: Action[] }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        padding: 1,
        borderRadius: 2,
      }}
    >
      {actions.map((action, index) => (
        <Button
          key={index}
          onClick={() => {
            if (
              !action.confirmMessage ||
              window.confirm(action.confirmMessage)
            ) {
              action.onClick();
            }
          }}
        >
          {action.label}
        </Button>
      ))}
    </Box>
  );
}
