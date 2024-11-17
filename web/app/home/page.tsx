"use client";

import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useCallback, useEffect, useState } from "react";
import request from "~/api/request";
import { motion, useAnimation } from "framer-motion";
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

  const onClickCross = useCallback(() => {
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
      <div className="h-full flex flex-col justify-center items-center">
        {displayedUser && (
          <div className="h-full flex flex-col justify-center items-center">
           {nextUser && (
            <div className="relative w-full h-full">
              <div className="absolute inset-0 z-0 mt-4 transform -translate-x-1/2">
                <Card displayedUser={nextUser} />
              </div>
              <motion.div
                animate={controls}
                className="absolute inset-0 z-10 flex justify-center items-center mt-4"
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
            <div className="flex w-full mb-4 mt-4 space-x-8 button-container">
              <RoundButton onclick={onClickCross} icon={<CloseIconStyled />} />
              <RoundButton onclick={onClickHeart} icon={<FavoriteIconStyled />} />
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

const RoundButton = ({ onclick, icon }: RoundButtonProps) => (
  <button onClick={onclick} className="btn btn-circle shadow-md bg-white">
    {icon}
  </button>
);

const CloseIconStyled = () => (
  <CloseIcon className="text-gray-500 text-4xl" />
);

const FavoriteIconStyled = () => (
  <FavoriteIcon className="text-red-500 text-4xl" />
);
