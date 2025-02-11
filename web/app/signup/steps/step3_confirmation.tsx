import type { Step1User } from "common/zod/types";
import type { BackProp, StepProps } from "~/app/signup/common";
import CardBasicInfo from "~/components/CardBasicInfo";
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
    <div className="px-8 py-2">
      <h1 className="mb-2 text-xl">確認</h1>
      <p>以下の内容で登録する場合は「次へ」を押してください。</p>
      <h3 className="pt-4 text-lg">基本情報</h3>
      <div className="flex flex-col items-center py-4">
        <div
          className="rounded-md border-2 border-primary bg-secondary p-5"
          style={{ width: "min(50dvh, 87.5vw)" }}
        >
          <CardBasicInfo
            displayedUser={{
              ...Step1Data,
              ...Step2Data,
              id: 0, // dummy
              guid: "zero", // dummy
            }}
          />
        </div>
      </div>
      <h3 className="pt-4 text-lg">自己紹介</h3>
      <p className="pt-2">{Step1Data.intro}</p>
      <div className="fixed bottom-0 left-0 flex w-full justify-between p-3">
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
    </div>
  );
}
