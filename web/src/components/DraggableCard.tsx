import { motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useCallback, useState } from "react";
import type { User, UserID } from "../common/types";
import { Card } from "./Card";

const SWIPE_THRESHOLD = 125;

interface DraggableCardProps {
  displayedUser: User;
  comparisonUserId?: UserID;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  onDrag?: (X: number) => void;
}

export const DraggableCard = ({
  displayedUser,
  comparisonUserId,
  onSwipeRight,
  onSwipeLeft,
  onDrag,
}: DraggableCardProps) => {
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const [dragging, setDragging] = useState(false);

  useMotionValueEvent(dragX, "change", (latest: number) => {
    if (dragging) {
      dragX.set(latest);
      if (onDrag) {
        onDrag(latest);
      }
    } else {
      dragX.set(0);
      if (onDrag) {
        onDrag(0);
      }
    }
  });

  useMotionValueEvent(dragY, "change", (latest: number) => {
    if (dragging) {
      dragY.set(latest);
    } else {
      dragY.set(0);
    }
  });

  const handleDragEnd = useCallback(() => {
    const x = dragX.get();
    if (x > SWIPE_THRESHOLD) {
      onSwipeRight();
    }
    if (x < -SWIPE_THRESHOLD) {
      onSwipeLeft();
    }
    dragX.set(0);
    dragY.set(0);
  }, [dragX, dragY, onSwipeRight, onSwipeLeft]);

  return (
    <section
      style={{ pointerEvents: dragging ? "none" : undefined, height: "100%" }}
    >
      <motion.div
        drag
        dragElastic={0.9}
        dragListener={true}
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => {
          setDragging(false);
          handleDragEnd();
        }}
        style={{ x: dragX, y: dragY, padding: "10px" }}
        whileTap={{ scale: 0.95 }}
      >
        <Card
          displayedUser={displayedUser}
          comparisonUserId={comparisonUserId}
        />
      </motion.div>
    </section>
  );
};
