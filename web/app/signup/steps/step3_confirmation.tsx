import type { Step1User } from "common/zod/types";
import type { BackProp, StepProps } from "~/app/signup/common";
import { CardFront } from "~/components/Card.tsx";
import type { Step2Data } from "./step2_img";

interface inputDataProps {
  Step1Data: Step1User | undefined;
  Step2Data: Step2Data | undefined;
}

export default function Confirmation({
  onSave,
  back,
  Step1Data,
  Step2Data,
}: StepProps<void> & BackProp & inputDataProps) {
  if (!Step1Data || !Step2Data) {
    throw new Error("don't skip the steps");
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "20px",
        }}
      >
        <h1 className="mb-2 text-xl">確認</h1>
        <div className="flex flex-col items-center">
          <CardFront
            displayedUser={{
              ...Step1Data,
              ...Step2Data,
              id: 0,
              guid: "zero",
            }}
          />
        </div>
        <div className="flex flex-col items-center">
          <p>この内容で登録しますか？</p>
        </div>
      </div>
      <div className="fixed bottom-0 flex w-full justify-between p-3">
        <button type="button" onClick={back} className="btn">
          前へ
        </button>
        <button
          type="button"
          onClick={() => onSave()}
          className="btn btn-primary"
        >
          次へ
        </button>
      </div>
    </>
  );
}
