"use client";

import { useState } from "react";
import Matchings from "~/components/match/matching";
import Requests from "~/components/match/requests";

export default function Friends() {
  const [activeTab, setActiveTab] = useState("matching");

  return (
    <div className="w-full">
      <div className="flex w-full border-gray-200 border-b">
        <button
          type="button"
          className={`relative flex-1 py-2 text-center ${
            activeTab === "matching" ? "text-blue-600" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("matching")}
        >
          <span>タブ1</span>
          {activeTab === "matching" && (
            <span className="absolute bottom-0 left-0 h-1 w-full bg-blue-500" />
          )}
        </button>

        <button
          type="button"
          className={`relative flex-1 py-2 text-center ${
            activeTab === "request" ? "text-blue-600" : "text-gray-600"
          }`}
          onClick={() => setActiveTab("request")}
        >
          <span>タブ2</span>
          {activeTab === "request" && (
            <span className="absolute bottom-0 left-0 h-1 w-full bg-blue-500" />
          )}
        </button>
      </div>

      {/* コンテンツ部分 */}
      <div className="mt-4 text-center text-gray-700 text-lg">
        {activeTab === "matching" ? <Matchings /> : <Requests />}
      </div>
    </div>
  );
}
