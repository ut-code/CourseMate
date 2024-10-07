import ThreeSixtyIcon from "@mui/icons-material/ThreeSixty";
import { Chip } from "@mui/material";
import { useEffect, useState } from "react";
import type { User, UserID } from "../common/types";
import NonEditableCoursesTable from "./course/NonEditableCoursesTable";
import UserAvatar from "./human/avatar";

interface CardProps {
  displayedUser: User;
  comparisonUserId?: UserID;
  onFlip?: (isBack: boolean) => void;
}

export function Card({ displayedUser, comparisonUserId, onFlip }: CardProps) {
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
        width: "min(40dvh, 87.5vw)",
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
          <CardBack
            displayedUser={displayedUser}
            comparisonUserId={comparisonUserId}
          />
        </div>
      </div>
    </div>
  );
}

const CardFront = ({ displayedUser }: CardProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F7FCFF",
        border: "2px solid #3596C6",
        padding: "20px 20px 10px 20px",
        height: "100%",
        gap: "2dvh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          alignItems: "center",
          height: "30%",
        }}
      >
        <UserAvatar
          pictureUrl={displayedUser.pictureUrl}
          width="10dvh"
          height="10dvh"
        />
        <p
          style={{
            fontSize: "4vh",
            fontWeight: "bold",
            gridColumn: "2 / 4",
            margin: "1.1dvh",
          }}
        >
          {displayedUser.name}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.1dvh",
        }}
      >
        <Chip label="学部" size="small" />
        <span
          style={{
            fontSize: "3dvh",
          }}
        >
          {displayedUser.faculty}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.1dvh",
        }}
      >
        <Chip label="学科" size="small" />
        <span
          style={{
            fontSize: "1.76dvh",
          }}
        >
          {displayedUser.department}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.1dvh",
        }}
      >
        <Chip label="性別" size="small" />
        <span style={{ fontSize: "3dvh" }}>{displayedUser.gender}</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.1dvh",
        }}
      >
        <Chip label="学年" size="small" />
        <span style={{ fontSize: "3dvh" }}> {displayedUser.grade}</span>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: "1.1dvh",
        }}
      >
        <Chip
          label="自己紹介"
          size="small"
          sx={{
            fontSize: "0.5rem",
          }}
        />
        <span style={{ fontSize: "1.76dvh" }}>{displayedUser.intro}</span>
      </div>

      <div>
        <ThreeSixtyIcon
          style={{ fontSize: "3.08dvh", display: "block", margin: "auto" }}
        />
      </div>
    </div>
  );
};

const CardBack = ({ displayedUser, comparisonUserId }: CardProps) => {
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
      <NonEditableCoursesTable
        userId={displayedUser.id}
        comparisonUserId={comparisonUserId}
      />
      <div>
        <ThreeSixtyIcon
          style={{ fontSize: "3.08dvh", display: "block", margin: "auto" }}
        />
      </div>
    </div>
  );
};
