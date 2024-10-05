import ThreeSixtyIcon from "@mui/icons-material/ThreeSixty";
import { useEffect, useState } from "react";
import type { User } from "../common/types";
import NonEditableCoursesTable from "./course/NonEditableCoursesTable";
import UserAvatar from "./human/avatar";

interface CardProps {
  displayedUser: User;
  onFlip?: (isBack: boolean) => void;
}

export function Card({ displayedUser, onFlip }: CardProps) {
  const [isDisplayingBack, setIsDisplayingBack] = useState(false);

  const handleRotate = () => {
    setIsDisplayingBack(!isDisplayingBack);
    if (onFlip) onFlip(!isDisplayingBack);
  };

  // biome-ignore lint: FIXME! 本来はuseEffectではなくスワイプのイベントで実装するべき
  useEffect(() => {
    const card = document.getElementById("card");

    if (card) {
      card.style.transition = "none";
      setIsDisplayingBack(false);

      requestAnimationFrame(() => {
        if (card) {
          card.style.transition = "transform 600ms";
        }
      });
    }
  }, [displayedUser]);

  return (
    // biome-ignore lint: this cannot just be fixed rn FIXME!
    <div
      style={{
        perspective: "1000px",
        width: "85vw",
        height: "70dvh",
        position: "relative",
      }}
      onClick={handleRotate}
    >
      <div
        id="card"
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
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "30% 10% 10% 10% 10% 10% 20%",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <UserAvatar
          pictureUrl={displayedUser?.pictureUrl}
          width="10vh"
          height="10vh"
        />
        {displayedUser?.name && (
          <p
            style={{
              fontSize: "5vmin",
              fontWeight: "bold",
              gridColumn: "2 / 4",
              gridRow: "1 / 2",
              margin: "10px",
              marginRight: "0",
            }}
          >
            {displayedUser?.name}
          </p>
        )}

        {displayedUser?.department && (
          <p
            style={{
              fontSize: "4vmin",
              gridColumn: "1 / 4",
              gridRow: "3 / 4",
            }}
          >
            {displayedUser.department}
          </p>
        )}
        <p
          style={{
            fontSize: "5vmin",
            gridColumn: "1 / 3",
            gridRow: "2 / 3",
          }}
        >
          {`${displayedUser.faculty}`}
        </p>
        <p
          style={{
            fontSize: "5vmin",
            gridColumn: "2 / 4",
            gridRow: "4 / 5",
          }}
        >
          {displayedUser?.grade}
        </p>
        <p style={{ fontSize: "5vmin", gridColumn: "1 / 3", gridRow: "4 / 5" }}>
          {displayedUser.gender}
        </p>
        {displayedUser?.intro && (
          <p
            style={{
              fontSize: "4vmin",
              gridColumn: "1 / 4",
              gridRow: "5 / 8",
              alignSelf: "start",
            }}
          >
            {displayedUser.intro}
          </p>
        )}
      </div>
      <div style={{ position: "absolute", bottom: "0", right: "0", left: "0" }}>
        <ThreeSixtyIcon
          style={{ fontSize: "7vmin", display: "block", margin: "auto" }}
        />
      </div>
    </div>
  );
};

const CardBack = ({ displayedUser }: CardProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F7FCFF",
        border: "2px solid #3596C6",
        padding: "10px",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p style={{ fontSize: "1rem", fontWeight: "bold" }}>
          {displayedUser?.name}
        </p>
      </div>
      <NonEditableCoursesTable userId={displayedUser.id} />
      <div>
        <ThreeSixtyIcon
          style={{ fontSize: "7vmin", display: "block", margin: "auto" }}
        />
      </div>
    </div>
  );
};
