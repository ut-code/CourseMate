"use client";

import type { UserWithCoursesAndSubjects } from "common/types";
import { motion, useAnimation } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MdClose, MdThumbUp } from "react-icons/md";
import request from "~/api/request";
import { useAboutMe, useRecommended } from "~/api/user";
import { Card } from "~/components/Card";
import { DraggableCard } from "~/components/DraggableCard";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import BackgroundText from "../../components/common/BackgroundText";
import PersonDetailedMenu from "./components/PersonDetailedMenu";
import RoundButton from "./components/RoundButton";

export default function Home() {
  const { data, error } = useRecommended();
  const controls = useAnimation();
  const backCardControls = useAnimation();
  const [clickedButton, setClickedButton] = useState<string>("");
  const [openDetailedMenu, setOpenDetailedMenu] = useState(false);

  const {
    state: { data: currentUser },
  } = useAboutMe();

  const [_, rerender] = useState({});
  const [recommended, setRecommended] = useState<
    Queue<UserWithCoursesAndSubjects>
  >(() => new Queue([]));
  const [loading, setLoading] = useState<boolean>(true);

  // コンテナと topCard の DOM 参照を用意
  const containerRef = useRef<HTMLDivElement>(null);
  const topCardRef = useRef<HTMLDivElement>(null);
  // topCard のコンテナ内での相対位置（backCard の最終的な配置位置）を保存
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });

  // 初期オフセット：右方向へのずれを防ぐため x は 0、縦方向は必要に応じて設定（例: 20）
  const initialOffset = { x: 0, y: 0 };

  // レイアウト完了後に topCard の位置を計算する
  useLayoutEffect(() => {
    if (topCardRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const topCardRect = topCardRef.current.getBoundingClientRect();
      setTargetPos({
        x: topCardRect.left - containerRect.left,
        y: topCardRect.top - containerRect.top,
      });
      // backCard のコントロールに初期オフセットを設定（レンダリング位置と合わせる）
      backCardControls.set(initialOffset);
    }
  }, [backCardControls]);

  useLayoutEffect(() => {
    if (data) setRecommended(new Queue(data));
  }, [data]);

  useEffect(() => {
    if (data) {
      setRecommended(new Queue(data));
      setLoading(false);
    }
  }, [data]);

  const displayedUser = recommended.peek(0);
  const nextUser = recommended.peek(1);

  const handleAction = useCallback(
    async (action: "accept" | "reject") => {
      const current = recommended.peek(0);
      if (!current) return;

      setClickedButton(action === "accept" ? "heart" : "cross");

      // アニメーション開始前に backCard を初期レンダリング位置（initialOffset）に設定
      backCardControls.set(initialOffset);

      await Promise.all([
        // トップカードは画面外へ移動（画面サイズに合わせる）
        controls.start({
          x: action === "accept" ? window.innerWidth : -window.innerWidth,
          transition: { duration: 0.5, delay: 0.2 },
        }),
        // backCard は computed した topCard の位置 (targetPos) に移動
        backCardControls.start({
          x: targetPos.x,
          y: targetPos.y,
          transition: { duration: 0.5, delay: 0.2 },
        }),
      ]);

      // キューの更新などの処理
      recommended.pop();
      rerender({});

      if (action === "accept") {
        sendAcceptRequest(current.id);
      } else {
        recommended.push(current);
      }

      // アニメーション後に位置をリセット（backCard は再び初期レンダリング位置に戻す）
      controls.set({ x: 0 });
      backCardControls.set(initialOffset);
      setClickedButton("");
    },
    [recommended, controls, backCardControls, targetPos],
  );

  async function sendAcceptRequest(userId: number) {
    try {
      await request.send(userId);
    } catch (error) {
      console.error("Failed to send accept request:", error);
    }
  }

  if (loading) {
    return <FullScreenCircularProgress />;
  }
  if (currentUser == null) {
    return <FullScreenCircularProgress />;
  }
  if (recommended.size() === 0 && loading === false) {
    return <BackgroundText text="「いいね！」を送るユーザーがいません。" />;
  }
  if (error) throw error;

  return (
    <div
      ref={containerRef}
      className="flex h-full flex-col items-center justify-center p-4"
    >
      {displayedUser && (
        <div className="flex h-full flex-col items-center justify-center">
          {nextUser && (
            <div className="relative grid h-full w-full grid-cols-1 grid-rows-1">
              {/* backCard: 初期レンダリング位置とアニメーション開始位置を両方とも initialOffset に合わせる */}
              <motion.div
                className="z-0 col-start-1 row-start-1 mt-4"
                initial={initialOffset}
                animate={backCardControls}
              >
                <Card displayedUser={nextUser} currentUser={currentUser} />
              </motion.div>
              {/* トップカード: この位置を基準にするために ref を設定 */}
              <motion.div
                ref={topCardRef}
                className="z-10 col-start-1 row-start-1 mt-4"
                animate={controls}
              >
                <DraggableCard
                  displayedUser={displayedUser}
                  currentUser={currentUser}
                  onSwipeLeft={() => handleAction("reject")}
                  onSwipeRight={() => handleAction("accept")}
                  clickedButton={clickedButton}
                  setOpenDetailedMenu={setOpenDetailedMenu}
                />
              </motion.div>
            </div>
          )}
          {nextUser == null && (
            <div className="relative grid h-full w-full grid-cols-1 grid-rows-1">
              <motion.div
                ref={topCardRef}
                className="z-10 col-start-1 row-start-1 mt-4 flex items-center justify-center"
                animate={controls}
              >
                <DraggableCard
                  displayedUser={displayedUser}
                  currentUser={currentUser}
                  onSwipeLeft={() => handleAction("reject")}
                  onSwipeRight={() => handleAction("accept")}
                  clickedButton={clickedButton}
                  setOpenDetailedMenu={setOpenDetailedMenu}
                />
              </motion.div>
            </div>
          )}
          <div className="mt-2 mb-4 flex w-full justify-around px-8">
            <RoundButton
              onclick={() => handleAction("reject")}
              icon={<MdClose className="text-3xl text-gray-500" />}
            />
            <RoundButton
              onclick={() => handleAction("accept")}
              icon={<MdThumbUp className="text-3xl text-primary" />}
            />
          </div>
          {openDetailedMenu && (
            <PersonDetailedMenu
              onClose={() => {
                setOpenDetailedMenu(false);
              }}
              displayedUser={displayedUser}
              currentUser={currentUser}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Queue クラス（状態管理用）
class Queue<T> {
  private store: T[];
  constructor(initial: T[]) {
    this.store = initial;
  }
  push(top: T): void {
    this.store.push(top);
  }
  // peek(0): 次にポップされる要素、peek(1): その次の要素
  peek(nth: number): T | undefined {
    return this.store[nth];
  }
  pop(): T | undefined {
    return this.store.shift();
  }
  size(): number {
    return this.store.length;
  }
}
