"use client";

import CloseIcon from "@mui/icons-material/Close";
import { motion, useAnimation } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { MdThumbUp } from "react-icons/md";
import request from "~/api/request";
import { useMyID, useRecommended } from "~/api/user";
import { Card } from "~/components/Card";
import { DraggableCard } from "~/components/DraggableCard";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";

export default function Home() {
  const { data: recommended, error } = useRecommended();
  const [nth, setNth] = useState<number>(0);
  const displayedUser = recommended?.[nth];
  const nextUser = recommended?.[nth + 1];
  const controls = useAnimation();
  const [clickedButton, setClickedButton] = useState<string>("");
  const {
    state: { data: myId },
  } = useMyID();

  const reject = useCallback(() => {
    if (!displayedUser) return;
    recommended?.push(displayedUser);
    setNth((n) => n + 1);
  }, [displayedUser, recommended]);

  const accept = useCallback(async () => {
    setNth((n) => n + 1);
    if (displayedUser?.id) request.send(displayedUser.id);
  }, [displayedUser?.id]);

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

  useEffect(() => {
    if (!displayedUser) {
      setNth(0);
    }
  }, [displayedUser]);

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
              <div className="relative h-full w-full">
                <div className="-translate-x-4 -translate-y-4 inset-0 z-0 mt-4 transform">
                  <Card displayedUser={nextUser} />
                </div>
                <motion.div
                  animate={controls}
                  className="absolute inset-0 z-10 mt-4 flex items-center justify-center"
                >
                  <DraggableCard
                    displayedUser={displayedUser}
                    comparisonUserId={myId || undefined}
                    onSwipeLeft={reject}
                    onSwipeRight={accept}
                    clickedButton={clickedButton}
                  />
                </motion.div>
              </div>
            )}
            <div className="button-container mt-4 mb-4 flex w-full justify-center space-x-8">
              <CloseButton onclick={onClickClose} icon={<CloseIconStyled />} />
              <GoodButton
                onclick={onClickHeart}
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
