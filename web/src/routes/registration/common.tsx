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

export function NextButton({
  onClick,
  caller,
  weak,
  children,
}: {
  onClick: () => void;
  caller: Caller;
  weak?: boolean;
  children: string;
}) {
  switch (caller) {
    case "registration":
      return (
        <Button
          variant={weak ? "text" : "contained"}
          sx={{
            alignSelf: "space-between",
          }}
          onClick={onClick}
        >
          {children}
        </Button>
      );

    case "configMenu":
      return (
        <Button
          variant="outlined"
          sx={{
            color: "blue",
            textTransform: "none",
          }}
          onClick={onClick}
        >
          {children}
        </Button>
      );

    default:
      // make it a compile error
      neverer = caller;
      console.log(neverer);
  }
}

let neverer: never;
