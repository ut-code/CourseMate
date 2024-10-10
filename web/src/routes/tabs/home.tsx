import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import request from "../../api/request";

import shadows from "@mui/material/styles/shadows";
import { motion, useAnimation } from "framer-motion";
import { useMyID, useRecommended } from "../../api/user";
import type { User } from "../../common/types";
import { Card } from "../../components/Card";
import { DraggableCard } from "../../components/DraggableCard";
import FullScreenCircularProgress from "../../components/common/FullScreenCircularProgress";

export default function Home() {
  const { data, loading, error } = useRecommended();
  const [_, rerender] = useState({});
  const [recommended, setRecommended] = useState<Queue<User>>(
    () => new Queue([]),
  );
  useEffect(() => {
    if (data) setRecommended(new Queue(data));
  }, [data]);

  const displayedUser = recommended.peek(1);
  const nextUser = recommended.peek(2);
  const controls = useAnimation();
  const [clickedButton, setClickedButton] = useState<string>("");
  const {
    state: { data: myId },
  } = useMyID();

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

  if (recommended == null || loading) {
    return <FullScreenCircularProgress />;
  }
  if (displayedUser == null) {
    return <div>全員にいいねを送りました！</div>;
  }
  if (error) {
    return <div>Something went wrong: {error.message}</div>;
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {displayedUser ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-evenly"
          alignItems="center"
          height="100%"
        >
          <Box style={{ position: "relative" }}>
            {nextUser ? (
              <Box
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  zIndex: -1,
                }}
              >
                <Card displayedUser={nextUser} />
              </Box>
            ) : null}
            <motion.div animate={controls}>
              <DraggableCard
                displayedUser={displayedUser}
                comparisonUserId={myId ? myId : undefined}
                onSwipeLeft={reject}
                onSwipeRight={accept}
                clickedButton={clickedButton}
              />
            </motion.div>
          </Box>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              width: "min(100%, 46dvh)",
              marginBottom: "10px",
            }}
          >
            <RoundButton onclick={onClickCross} icon={<CloseIconStyled />} />
            <RoundButton onclick={onClickHeart} icon={<FavoriteIconStyled />} />
          </div>
        </Box>
      ) : (
        <FullScreenCircularProgress />
      )}
    </div>
  );
}

interface RoundButtonProps {
  onclick: () => void;
  icon: JSX.Element;
}

const RoundButton = ({ onclick, icon }: RoundButtonProps) => {
  return (
    <div>
      <Button onClick={onclick} style={ButtonStyle}>
        {icon}
      </Button>
    </div>
  );
};

const ButtonStyle = {
  borderRadius: "50%",
  width: "7dvh",
  height: "7dvh",
  boxShadow: shadows[10],
  backgroundColor: "white",
};

const CloseIconStyled = () => {
  return <CloseIcon style={{ color: "grey", fontSize: "4.5dvh" }} />;
};

const FavoriteIconStyled = () => {
  return <FavoriteIcon style={{ color: "red", fontSize: "4.5dvh" }} />;
};

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
