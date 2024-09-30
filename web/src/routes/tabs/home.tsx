import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Button, CircularProgress } from "@mui/material";
import { useCallback, useState } from "react";
import request from "../../api/request";

import shadows from "@mui/material/styles/shadows";
import { useRecommended } from "../../api/user";
import { DraggableCard } from "../../components/DraggableCard";

const getBackgroundColor = (x: number) => {
  const maxVal = 300; // 255より大きくして原色や黒にならないようにする
  const normalizedValue = Math.max(-maxVal, Math.min(maxVal, x / 2));

  // xが0に近いと白、正の方向に進むと緑、負の方向に進むと赤
  if (normalizedValue === 0) {
    return `rgb(${maxVal}, ${maxVal}, ${maxVal})`; // 白
  }
  if (normalizedValue > 0) {
    const redValue = Math.floor((Math.abs(normalizedValue) / maxVal) * 255);
    return `rgb(${maxVal}, ${maxVal - redValue}, ${maxVal - redValue})`; // 赤
  }
  const grayValue = Math.floor((Math.abs(normalizedValue) / maxVal) * 255);
  return `rgb(${maxVal - grayValue}, ${maxVal - grayValue}, ${
    maxVal - grayValue
  })`; // 灰色
};

export default function Home() {
  const { data: recommended } = useRecommended();
  const [nth, setNth] = useState<number>(0);
  const displayedUser = recommended?.[nth]; // biome told me to do this
  const isAllUsersLiked = recommended?.length === nth;

  const [dragValue, setDragValue] = useState(0); // x方向の値を保存
  const handleDrag = useCallback((dragProgress: number) => {
    setDragValue(dragProgress);
  }, []);

  if (isAllUsersLiked) {
    return <div>全員にいいねを送りました！</div>;
  }

  const reject = useCallback(() => setNth((n) => n + 1), []);
  const accept = useCallback(async () => {
    setNth((n) => n + 1);
    if (displayedUser?.id) request.send(displayedUser.id);
  }, [displayedUser?.id]);

  return (
    <div style={{ backgroundColor: getBackgroundColor(dragValue) }}>
      {displayedUser ? (
        <Box display="flex" flexDirection="column" alignItems="center">
          <DraggableCard
            displayedUser={displayedUser}
            onSwipeLeft={reject}
            onSwipeRight={accept}
            onDrag={handleDrag}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              width: "50%",
            }}
          >
            <RoundButton onclick={reject} icon={<CloseIconStyled />} />
            <RoundButton onclick={accept} icon={<FavoriteIconStyled />} />
          </div>
        </Box>
      ) : (
        <CircularProgress />
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
  width: "7vw",
  height: "auto",
  margin: "10px",
  boxShadow: shadows[10],
  backgroundColor: "white",
};

const CloseIconStyled = () => {
  return <CloseIcon style={{ color: "grey", fontSize: "5vw" }} />;
};

const FavoriteIconStyled = () => {
  return <FavoriteIcon style={{ color: "red", fontSize: "5vw" }} />;
};
