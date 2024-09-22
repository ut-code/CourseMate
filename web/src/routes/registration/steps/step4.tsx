import { Button } from "@mui/material";
import type { BackProp, StepProps } from "../common";
export default function Confirmation({
  onSave,
  back,
}: StepProps<void> & BackProp) {
  return (
    <>
      <div>本当によろしいですか？</div>
      <Button onClick={back}>戻る</Button>
      <Button onClick={() => onSave()}>OK</Button>
    </>
  );
}
