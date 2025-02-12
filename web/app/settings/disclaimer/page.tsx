"use client";

import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";
import { useSetHeaderFooter } from "~/hooks/useLayoutHeaderFooter";

export default function Disclaimer() {
  useSetHeaderFooter(
    { title: "免責事項", backButtonPath: "/settings" },
    { activeTab: "4_settings" },
  );
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <div className="flex flex-col p-2">
        <div className="w-full p-8 text-left">
          <p className="mb-4 leading-7">
            本サービスはut.code();によって運営されており、東京大学は運営に関与しておりません。本サービスは東大生のみを対象としており、ECCSアカウントによるログインが必須です。
          </p>

          <p className="mb-4 leading-7">
            本サービスの機能の利用に伴ういかなるトラブルや損害について、ut.code();は一切の責任を負いかねます。利用者の自己責任においてご利用ください。
          </p>

          <p className="mb-4 leading-7">
            本サービスで収集した個人情報は、サインインおよびサービス提供の目的にのみ使用され、他の目的には使用されません。
          </p>

          <p className="mb-4 leading-7">
            本サービスを通じて他の利用者と接触した際のトラブルや、マッチングを通じて生じた問題等に関しても、ut.code();は責任を負いません。ご理解とご協力をお願いいたします。
          </p>
        </div>
      </div>
    </NavigateByAuthState>
  );
}
