"use client";

import Link from "next/link";
import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { useAboutMe } from "~/api/user";
import { Card } from "~/components/Card";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";
import TopNavigation from "~/components/common/TopNavigation";

export default function SettingsProfile() {
  const { state } = useAboutMe();
  const data = state.data;
  const error = state.current === "error" ? state.error : null;
  const loading = state.current === "loading";
  const [back, setBack] = useState<boolean>(false);

  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      {loading ? (
        <FullScreenCircularProgress />
      ) : error ? (
        <p className="text-error">エラーが発生しました。{error.message}</p>
      ) : !data ? (
        <p>データがありません。</p>
      ) : (
        <div className="flex flex-col p-2">
          <TopNavigation title="あなたのカード" />
          <div className="flex flex-1 flex-col items-center">
            <div className="flex w-full justify-end">
              <Link
                className="btn btn-sm flex items-center border-none bg-white px-1 text-primary shadow-none"
                href={back ? "/edit/courses" : "/edit/profile"}
                style={{
                  // (画面幅 - カード幅) / 2 - profile の padding
                  marginRight:
                    "calc(calc(calc(100vw - min(40dvh, 87.5vw)) / 2) - 8px)",
                }}
              >
                <MdEdit className="text-lg" />
                編集する
              </Link>
            </div>
            <Card displayedUser={data} onFlip={(back) => setBack(back)} />
          </div>
        </div>
      )}
    </NavigateByAuthState>
  );
}
