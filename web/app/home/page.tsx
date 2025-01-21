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
import PersonDetailedMenu from "./components/PersonDetailedMenu";

export default function Home() {
  const { data, error } = useRecommended();
  const controls = useAnimation();
  const [clickedButton, setClickedButton] = useState<string>("");
  const [openDetailedMenu, setOpenDetailedMenu] = useState(false);
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
  const reject = useCallback(() => {
    const current = recommended.pop();
    if (!current) return;
    recommended.push(current);
    rerender({});
  }, [recommended]);
  const accept = useCallback(async () => {
    const current = recommended.pop();
    if (!current) return;
    request.send(current.id);
    rerender({});
  }, [recommended]);

  const onClickClose = useCallback(() => {
    setClickedButton("cross");
    controls
      .start({
        x: [0, -1000],
        transition: { duration: 0.5, times: [0, 1], delay: 0.2 },
      })
      .then(() => {
        reject();
        setClickedButton("");
        controls.set({ x: 0 });
      });
  }, [controls, reject]);

  const onClickHeart = useCallback(() => {
    setClickedButton("heart");
    controls
      .start({
        x: [0, 1000],
        transition: { duration: 0.5, times: [0, 1], delay: 0.2 },
      })
      .then(() => {
        accept();
        setClickedButton("");
        controls.set({ x: 0 });
      });
  }, [controls, accept]);

  if (currentUser == null) {
    return <FullScreenCircularProgress />;
  }
  if (recommended == null) {
    return <FullScreenCircularProgress />;
  }
  if (displayedUser == null) {
    return <div>全員にいいねを送りました！</div>;
  }
  if (error) throw error;

  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <div className="flex h-full flex-col items-center justify-center p-4">
        {displayedUser && (
          <>
            <div className="flex h-full flex-col items-center justify-center">
              {nextUser && (
                <div className="relative h-full w-full">
                  <div className="-translate-x-4 -translate-y-4 inset-0 z-0 mt-4 transform">
                    <Card displayedUser={nextUser} currentUser={currentUser} />
                  </div>
                  <motion.div
                    animate={controls}
                    className="absolute inset-0 z-10 mt-4 flex items-center justify-center"
                  >
                    <DraggableCard
                      displayedUser={displayedUser}
                      currentUser={currentUser}
                      onSwipeLeft={reject}
                      onSwipeRight={accept}
                      clickedButton={clickedButton}
                    />
                  </motion.div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setOpenDetailedMenu(!openDetailedMenu)}
              >
                てすと
              </button>
              <div className="button-container mt-4 mb-4 flex w-full justify-center space-x-8">
                <CloseButton
                  onclick={onClickClose}
                  icon={<CloseIconStyled />}
                />
                <GoodButton
                  onclick={onClickHeart}
                  icon={<FavoriteIconStyled />}
                />
              </div>
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
          </>
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
  // peek(1) to peek the next elem to be popped, peek(2) peeks the second next element to be popped.
  peek(nth: number): T | undefined {
    return this.store[nth - 1];
  }
  pop(): T | undefined {
    return this.store.shift();
    // yes, I know what you want to say, it has O(n) time complexity.
    // it doesn't really matter if there is only like 100 people in home queue at most.
    // if you really care about performance, why don't you go and limit the amount of people to fetch? that probably has significantly more impact to the performance.
  }
}
