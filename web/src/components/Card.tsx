import { User } from "../common/types";
import UserAvatar from "./avatar/avatar";
import { useState } from "react";
import CoursesTable from "./course/CoursesTable";
import ThreeSixtyIcon from "@mui/icons-material/ThreeSixty";

interface CardProps {
  displayedUser: User;
}

export const Card = ({ displayedUser }: CardProps) => {
  const [isDisplayingBack, setIsDisplayingBack] = useState(false);

  const handleRotate = () => {
    setIsDisplayingBack(!isDisplayingBack);
  };

  return (
    <div
      style={{
        perspective: "1000px",
        width: "70vw",
        height: "70vh",
        position: "relative",
      }}
      onClick={handleRotate}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 1s",
          transform: isDisplayingBack ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
          }}
        >
          <CardFront displayedUser={displayedUser} />
        </div>
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardBack displayedUser={displayedUser} />
        </div>
      </div>
    </div>
  );
};

const CardFront = ({ displayedUser }: CardProps) => {
  return (
    <div
      style={{
        backgroundColor: "#F7FCFF",
        border: "2px solid #3596C6",
        padding: "10px",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <div style={{ width: "50%", maxWidth: "300px", maxHeight: "300px" }}>
          <UserAvatar
            pictureUrl={displayedUser?.pictureUrl}
            width="80%"
            height="auto"
          />
        </div>
        <p style={{ fontSize: "4vw", fontWeight: "bold" }}>
          {displayedUser?.name}
        </p>
      </div>
      <div style={{ padding: "10px" }}>
        {displayedUser?.grade && <p>学年： {displayedUser.grade}</p>}
        {displayedUser?.faculity && <p>学部： {displayedUser.faculity}</p>}
        {displayedUser?.department && <p>学科： {displayedUser.department}</p>}
        {displayedUser?.gender && <p>性別： {displayedUser?.gender}</p>}
        {displayedUser?.intro && <p>自己紹介: {displayedUser.intro}</p>}
      </div>
      <div style={{ position: "absolute", bottom: "0", right: "0", left: "0" }}>
        <ThreeSixtyIcon
          style={{ fontSize: "7vw", display: "block", margin: "auto" }}
        />
      </div>
    </div>
  );
};

const CardBack = ({ displayedUser }: CardProps) => {
  return (
    <div
      style={{
        backgroundColor: "#F7FCFF",
        border: "2px solid #3596C6",
        padding: "10px",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p style={{ fontSize: "2vw", fontWeight: "bold" }}>
          {displayedUser?.name}
        </p>
      </div>
      <CoursesTable userId={displayedUser.id} />
      <div style={{ position: "absolute", bottom: "0", right: "0", left: "0" }}>
        <ThreeSixtyIcon
          style={{ fontSize: "7vw", display: "block", margin: "auto" }}
        />
      </div>
    </div>
  );
};
