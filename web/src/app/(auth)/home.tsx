import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import request from "../../api/request";

import shadows from "@mui/material/styles/shadows";
import { motion, useAnimation } from "framer-motion";
import { useMyID, useRecommended } from "../../api/user";
import { Card } from "../../components/Card";
import { DraggableCard } from "../../components/DraggableCard";
import FullScreenCircularProgress from "../../components/common/FullScreenCircularProgress";

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
  }, [displayedUser, recommended?.push /* ew */]);

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
