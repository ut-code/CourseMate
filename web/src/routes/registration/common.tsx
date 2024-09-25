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
        marginLeft: "auto", // 右に寄せるために margin-left を使用
        width: "100px",
        height: "44.5px",
        borderRadius: "25px",
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
