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
        justifyContent: "space-between",
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
        <div
          style={{
            display: "flex",
            gridColumn: "2 / 4",
            marginLeft: "1dvh",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "3.4vh",
              fontWeight: "bold",
              margin: "0 auto",
            }}
          >
            {displayedUser.name}
          </span>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 5fr",
          alignItems: "center",
          gap: "1.5dvh",
        }}
      >
        <Chip
          label="学部"
          size="small"
          sx={{
            gridColumn: "1 / 2",
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: "3dvh",
          }}
        >
          {displayedUser.faculty}
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 5fr",
          alignItems: "center",
          gap: "1.5dvh",
        }}
      >
        <Chip label="学科" size="small" />
        <p
          style={
            displayedUser.department.length <= 7
              ? {
                  margin: 0,
                  fontSize: "3dvh",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }
              : {
                  margin: 0,
                  fontSize: "1.76dvh",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }
          }
        >
          {displayedUser.department}
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 5fr",
          alignItems: "center",
          gap: "1.5dvh",
        }}
      >
        <Chip label="性別" size="small" />
        <p style={{ margin: 0, fontSize: "3dvh" }}>{displayedUser.gender}</p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 5fr",
          alignItems: "center",
          gap: "1.5dvh",
        }}
      >
        <Chip label="学年" size="small" />
        <p style={{ margin: 0, fontSize: "3dvh" }}> {displayedUser.grade}</p>
      </div>
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 5fr",
          gap: "1.5dvh",
          maxHeight: "32%", // WebKitLineClamp の フォールバックとして
        }}
      >
        <Chip
          label="自己紹介"
          size="small"
          sx={{
            fontSize: "0.45rem",
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: "1.76dvh",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 8,
            lineClamp: 8,
            textOverflow: "ellipsis",
          }}
        >
          {displayedUser.intro}
        </p>
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
