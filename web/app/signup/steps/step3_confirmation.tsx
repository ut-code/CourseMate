import type { Step1User } from "common/zod/types";
import type { BackProp, StepProps } from "~/app/signup/common";
import UserAvatar from "~/components/human/avatar";
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
      <div className="px-8 py-2">
        <h1 className="mb-2 text-xl">確認(3/5)</h1>
        <p>以下の内容で登録する場合は「次へ」を押してください。</p>
        <div className="p-6 space-y-10">
          <div className="w-6/6 mx-auto">
            <h3 className="text-xl font-bold mb-2">プロフィール画像</h3>
            <div className="card bg-white p-6">
              <UserAvatar
                pictureUrl={Step2Data.pictureUrl}
                width={"200"}
                height={"200"}
              />
            </div>
          </div>
          <div className="w-6/6 mx-auto">
            <h3 className="text-xl font-bold mb-2">基本情報</h3>
            <div className="card bg-white p-6">
              <p>名前：　　{Step1Data.name}</p>
              <p>学年：　　{Step1Data.grade}</p>
              <p>
                学部学科：{Step1Data.faculty}
                {Step1Data.department}
              </p>
            </div>
          </div>
          <div className="w-6/6 mx-auto">
            <h3 className="text-xl font-bold mb-2">自己紹介</h3>
            <div className="card bg-white p-6">
              <p className="pt-2">{Step1Data.intro}</p>
            </div>
          </div>
        </div>
      </div>
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
    </>
  );
}
