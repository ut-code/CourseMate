import { Button } from "@mui/material";
export type Caller = "registration" | "configMenu";
export type StepProps<T> = {
  onSave: (t: T) => void;
  prev?: T;
  caller: Caller;
};

export type BackProp = {
  back: () => void;
};

export function NavigationButton({
  onClick,
  weak,
  children,
}: {
  onClick: () => void;
  weak?: boolean;
  children: string;
}) {
  return (
    <Button
      variant={weak ? "text" : "contained"}
      sx={{
        alignSelf: "space-between",
        width: "40px",
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
