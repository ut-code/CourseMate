import ThreeSixtyIcon from "@mui/icons-material/ThreeSixty";
import { useState } from "react";
import type { User } from "../common/types";
import CoursesTable from "./course/CoursesTable";
import UserAvatar from "./human/avatar";

interface CardProps {
  displayedUser: User;
}

export function Card({ displayedUser }: CardProps) {
  const [isDisplayingBack, setIsDisplayingBack] = useState(false);

  const handleRotate = () => {
    setIsDisplayingBack(!isDisplayingBack);
  };

  return (
    // biome-ignore lint: this cannot just be fixed rn FIXME!
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
          transition: "transform 600ms",
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
}

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
          padding: "10px",
          display: "grid",
          gridTemplateColumns: "50% 50%",
          gridTemplateRows: "11vh 5vh 5vh 5vh 42vh",
          alignItems: "start",
          justifyContent: "space-around",
        }}
      >
        <div
          style={{
            maxWidth: "300px",
            maxHeight: "300px",
            gridColumn: "1 / 2",
            gridRow: "1 / 3",
          }}
        >
          <UserAvatar
            pictureUrl={displayedUser?.pictureUrl}
            width="90%"
            height="auto"
          />
        </div>

        {displayedUser?.name && (
          <p
            style={{
              fontSize: "5vw",
              fontWeight: "bold",
              gridColumn: "2 / 3",
              gridRow: "1 / 3",
            }}
          >
            {displayedUser?.name}
          </p>
        )}

        {displayedUser?.department && (
          <p
            style={{
              marginTop: "5%",
              fontSize: "4vw",
              gridColumn: "1 / 3",
              gridRow: "4 / 5",
            }}
          >
            {" "}
            {displayedUser.department}
          </p>
        )}
        <p
          style={{
            marginTop: "3%",
            fontSize: "4vw",
            gridColumn: "1 / 3",
            gridRow: "3 / 4",
          }}
        >
          {displayedUser?.faculty && (
            <span style={{ marginTop: "3%", fontSize: "5vw" }}>
              {`${displayedUser.faculty}··`}
            </span>
          )}
          <span>
            {`${
              displayedUser?.gender in ["男性", "女性"] // todo: maybe this needs some rewrite when gender becomes its concrete type instead of just string
                ? displayedUser?.gender
                : "性別は公開されていません"
            } `}
            {displayedUser.grade && displayedUser.grade}
          </span>
        </p>
        {displayedUser?.intro && (
          <p
            style={{ fontSize: "3.5vw", gridColumn: "1 / 3", gridRow: "5 / 6" }}
          >
            {displayedUser.intro}
          </p>
        )}
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
