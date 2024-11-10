"use client";

import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";
import Matchings from "~/components/match/matching";
import Requests from "~/components/match/requests";

export default function Friends() {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      {/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
      <div role="tablist" className="tabs tabs-bordered w-full">
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="マッチ中"
          defaultChecked
        />
        {/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
        <div role="tabpanel" className="tab-content p-10 ">
          <Matchings />
        </div>

        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab"
          aria-label="リクエスト"
        />
        {/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
        <div role="tabpanel" className="tab-content p-10">
          <Requests />
        </div>
      </div>
    </NavigateByAuthState>
  );
}
