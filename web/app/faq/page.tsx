"use client";

import { useSetHeaderFooter } from "~/hooks/useLayoutHeaderFooter";

export default function FAQ() {
  useSetHeaderFooter({ title: "よくある質問" }, { activeTab: "none" });
  return (
    <div className="absolute top-14 right-0 bottom-0 left-0 flex flex-column overflow-y-auto sm:top-16">
      <div className="flex flex-col p-2">
        <div className="w-full p-8 text-left">
          <p className="mb-4 leading-7">
            {/* TODO: この辺の構造を直す */}
            <strong>Q: 東大生以外も利用できますか？</strong>
            <br />
            A:
            本サービスは東大生のみを対象としています。それゆえ、ECCSアカウントによるログインが必須です。他のGoogleアカウントではログインできません。
          </p>

          <p className="mb-4 leading-7">
            <strong>Q: 授業登録機能はすべての学部に対応していますか？</strong>
            <br />
            A:
            本サービスの授業登録機能は前期教養学部のみに対応しており、今のところ後期学部には対応しておりません。
          </p>

          <p className="mb-4 leading-7">
            <strong>Q: 収集された個人情報はどのように利用されますか？</strong>
            <br />
            A:
            収集した個人情報は、サインインおよびサービス提供の目的にのみ使用され、他の目的には使用されません。
          </p>

          <p className="mb-4 leading-7">
            <strong>Q: 東大公式のアプリですか？</strong>
            <br />
            A:
            本サービスはut.code();によって運営されており、東京大学は運営に関与しておりません
          </p>
        </div>
      </div>
    </div>
  );
}
