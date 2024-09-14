import { useState, useCallback } from "react";
import { motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { PublicUser } from "../common/types";
import { Card } from "./Card";

const SWIPE_THRESHOLD = 200;

interface DraggableCardProps {
  displayedUser: PublicUser;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  onDrag?: (X: number) => void;
}

export const DraggableCard = ({
  displayedUser,
  onSwipeRight,
  onSwipeLeft,
  onDrag,
}: DraggableCardProps) => {
  const dragProgress = useMotionValue(0);
  const [dragging, setDragging] = useState(false);

  useMotionValueEvent(dragProgress, "change", (latest) => {
    if (typeof latest === "number" && dragging) {
      dragProgress.set(latest);
      if (onDrag) {
        onDrag(latest);
      }
    } else {
      dragProgress.set(0);
      if (onDrag) {
        onDrag(0);
      }
    }
  });

  const handleDragEnd = useCallback(() => {
    const x = dragProgress.get();
    if (x > SWIPE_THRESHOLD) {
      onSwipeRight();
    }
    if (x < -SWIPE_THRESHOLD) {
      onSwipeLeft();
    }
    dragProgress.set(0);
  }, [dragProgress, onSwipeRight, onSwipeLeft]);

  return (
    <section style={{ pointerEvents: dragging ? "none" : undefined }}>
      <motion.div
        drag="x"
        dragElastic={0.9}
        dragListener={true}
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => {
          setDragging(false);
          handleDragEnd();
        }}
        transition={{ duration: 0.5 }}
        style={{ x: dragProgress }}
      >
        <Card displayedUser={displayedUser} />
      </motion.div>
    </section>
  );
};
