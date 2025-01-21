"use client";
import { useState } from "react";

// https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
import dynamic from "next/dynamic";
const NoSSRMatchings = dynamic(() => import("~/components/match/matching"), {
  ssr: false,
});
const NoSSRRequests = dynamic(() => import("~/components/match/requests"), {
  ssr: false,
});

export default function Friends() {
  const [activeTab, setActiveTab] = useState("matching");

  return (
    <div className="w-full">
      <div className="flex w-full border-gray-200 border-b">
        <button
          type="button"
          className={`relative flex-1 py-3 text-center ${
            activeTab === "matching" ? "text-primary" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("matching")}
        >
          <span>マッチ</span>
          {activeTab === "matching" && (
            <span className="absolute bottom-0 left-0 h-1 w-full bg-primary" />
          )}
        </button>
        <button
          type="button"
          className={`relative flex-1 py-2 text-center ${
            activeTab === "request" ? "text-primary" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("request")}
        >
          <span>リクエスト</span>
          {activeTab === "request" && (
            <span className="absolute bottom-0 left-0 h-1 w-full bg-primary" />
          )}
        </button>
      </div>

      <div className="text-center text-gray-700 text-lg">
        {activeTab === "matching" ? <NoSSRMatchings /> : <NoSSRRequests />}
      </div>
    </div>
  );
}
