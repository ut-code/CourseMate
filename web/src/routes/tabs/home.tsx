import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import request from "../../api/request";

import shadows from "@mui/material/styles/shadows";
import { set } from "date-fns";
import { motion, useAnimation } from "framer-motion";
import { useRecommended } from "../../api/user";
import { DraggableCard } from "../../components/DraggableCard";
import FullScreenCircularProgress from "../../components/common/FullScreenCircularProgress";

export default function Home() {
  const { data: recommended, error } = useRecommended();

  const [nth, setNth] = useState<number>(0);
  const displayedUser = recommended?.[nth];
  const controls = useAnimation();
  const [clickedButton, setClickedButton] = useState<string>("");

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
          alignItems="center"
          height="100%"
        >
          <motion.div animate={controls}>
            <DraggableCard
              displayedUser={displayedUser}
              onSwipeLeft={reject}
              onSwipeRight={accept}
              clickedButton={clickedButton}
            />
          </motion.div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              width: "100%",
              height: "100%",
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
  width: "15vw",
  height: "15vw",
  boxShadow: shadows[10],
  backgroundColor: "white",
};

const CloseIconStyled = () => {
  return <CloseIcon style={{ color: "grey", fontSize: "10vw" }} />;
};

const FavoriteIconStyled = () => {
  return <FavoriteIcon style={{ color: "red", fontSize: "10vw" }} />;
};
