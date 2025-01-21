"use client";

import CloseIcon from "@mui/icons-material/Close";
import type { UserWithCoursesAndSubjects } from "common/types";
import { motion, useAnimation } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { MdThumbUp } from "react-icons/md";
import request from "~/api/request";
import { useAboutMe, useRecommended } from "~/api/user";
import { Card } from "~/components/Card";
import { DraggableCard } from "~/components/DraggableCard";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";

export default function Home() {
  const { data, error } = useRecommended();
  const controls = useAnimation();
  const backCardControls = useAnimation();
  const [clickedButton, setClickedButton] = useState<string>("");

  const {
    state: { data: currentUser },
  } = useAboutMe();

  const [_, rerender] = useState({});
  const [recommended, setRecommended] = useState<
    Queue<UserWithCoursesAndSubjects>
  >(() => new Queue([]));

  useEffect(() => {
    if (data) setRecommended(new Queue(data));
  }, [data]);

  const displayedUser = recommended.peek(1);
  const nextUser = recommended.peek(2);

  const handleAction = useCallback(
    async (action: "accept" | "reject") => {
      const current = recommended.peek(1);
      if (!current) return;

      setClickedButton(action === "accept" ? "heart" : "cross");

      // アニメーション開始前に BackCard の位置をリセット
      backCardControls.set({ x: 0, y: 0 });

      // 移動アニメーションを実行
      await Promise.all([
        controls.start({
          x: action === "accept" ? 1000 : -1000,
          transition: { duration: 0.5, delay: 0.2 },
        }),
        backCardControls.start({
          x: 10,
          y: 10,
          transition: { duration: 0.5, delay: 0.2 },
        }),
      ]);

      // 状態更新
      if (action === "accept") {
        await request.send(current.id);
      } else if (action === "reject") {
        recommended.push(current);
      }
      recommended.pop();
      rerender({});

      // 位置をリセット
      controls.set({ x: 0 });
      backCardControls.set({ x: 0, y: 0 });

      setClickedButton("");
    },
    [recommended, controls, backCardControls],
  );

  if (currentUser == null) {
    return <FullScreenCircularProgress />;
  }
  if (recommended == null) {
    return <FullScreenCircularProgress />;
  }
  if (displayedUser == null) {
    return <div>全員にいいねを送りました！</div>;
  }
  if (error) {
    return <div>Something went wrong: {error.message}</div>;
  }

  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <div className="flex h-full flex-col items-center justify-center">
        {displayedUser && (
          <div className="flex h-full flex-col items-center justify-center">
            {nextUser && (
              <div className="relative grid h-full w-full grid-cols-1 grid-rows-1">
                <motion.div
                  className="z-0 col-start-1 row-start-1 mt-4"
                  initial={{ x: 0, y: 0 }} // 初期位置を (0, 0) に設定
                  animate={backCardControls}
                >
                  <Card displayedUser={nextUser} currentUser={currentUser} />
                </motion.div>
                <motion.div
                  className="z-10 col-start-1 row-start-1 mt-4 flex items-center justify-center"
                  animate={controls}
                >
                  <DraggableCard
                    displayedUser={displayedUser}
                    currentUser={currentUser}
                    onSwipeLeft={() => handleAction("reject")}
                    onSwipeRight={() => handleAction("accept")}
                    clickedButton={clickedButton}
                  />
                </motion.div>
              </div>
            )}
            {nextUser == null && (
              <div className="relative grid h-full w-full grid-cols-1 grid-rows-1">
                <motion.div
                  className="z-10 col-start-1 row-start-1 mt-4 flex items-center justify-center"
                  animate={controls}
                >
                  <DraggableCard
                    displayedUser={displayedUser}
                    currentUser={currentUser}
                    onSwipeLeft={() => handleAction("reject")}
                    onSwipeRight={() => handleAction("accept")}
                    clickedButton={clickedButton}
                  />
                </motion.div>
              </div>
            )}
            <div className="button-container mt-4 mb-4 flex w-full justify-center space-x-8">
              <CloseButton
                onclick={() => handleAction("reject")}
                icon={<CloseIconStyled />}
              />
              <GoodButton
                onclick={() => handleAction("accept")}
                icon={<FavoriteIconStyled />}
              />
            </div>
          </div>
        )}
      </div>
    </NavigateByAuthState>
  );
}

interface RoundButtonProps {
  onclick: () => void;
  icon: JSX.Element;
}

const CloseButton = ({ onclick, icon }: RoundButtonProps) => (
  <button
    type="button"
    onClick={onclick}
    className="btn btn-circle bg-white shadow-md"
  >
    {icon}
  </button>
);
const GoodButton = ({ onclick, icon }: RoundButtonProps) => (
  <button
    type="button"
    onClick={onclick}
    className="btn btn-circle bg-white shadow-md"
  >
    {icon}
  </button>
);

const CloseIconStyled = () => <CloseIcon className="text-4xl text-gray-500" />;

const FavoriteIconStyled = () => (
  <MdThumbUp className="text-3xl text-primary" />
);

class Queue<T> {
  private store: T[];
  constructor(initial: T[]) {
    this.store = initial;
  }
  push(top: T): void {
    this.store.push(top);
  }
  peek(nth: number): T | undefined {
    return this.store[nth - 1];
  }
  pop(): T | undefined {
    return this.store.shift();
  }
}
