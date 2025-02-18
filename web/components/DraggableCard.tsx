import type { UserWithCoursesAndSubjects } from "common/types";
import { motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useCallback, useState } from "react";
import { MdClose, MdThumbUp } from "react-icons/md";
import { Card } from "./Card";

const SWIPE_THRESHOLD = 50;

interface DraggableCardProps {
  displayedUser: UserWithCoursesAndSubjects;
  currentUser: UserWithCoursesAndSubjects;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  clickedButton: string;
  setOpenDetailedMenu: (value: boolean) => void;
}

export const DraggableCard = ({
  displayedUser,
  currentUser,
  onSwipeRight,
  onSwipeLeft,
  clickedButton,
  setOpenDetailedMenu,
}: DraggableCardProps) => {
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const [dragging, setDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  useMotionValueEvent(dragX, "change", (latest: number) => {
    if (dragging) {
      setDragProgress(latest);
    } else {
      setDragProgress(0);
    }
  });

  // ドラッグ処理の他の部分はそのまま
  const CardOverlay = () => {
    return (
      <div>
        {dragProgress > SWIPE_THRESHOLD || clickedButton === "heart" ? (
          <div className="pointer-events-none absolute z-20 flex h-[70dvh] w-[min(50dvh,87.5vw)] items-center justify-center rounded-md bg-[rgba(3,155,229,0.4)]">
            <div className="flex h-[16dvh] w-[16dvh] flex-col items-center justify-center rounded-full bg-white">
              <MdThumbUp className="text-5xl text-primary" />
              <span className="text-lg">いいね！</span>
            </div>
          </div>
        ) : dragProgress < -SWIPE_THRESHOLD || clickedButton === "cross" ? (
          <div className="pointer-events-none absolute z-20 flex h-[70dvh] w-[min(50dvh,87.5vw)] items-center justify-center rounded-md bg-[rgba(0,0,0,0.3)]">
            <div className="flex h-[16dvh] w-[16dvh] flex-col items-center justify-center rounded-full bg-white">
              <MdClose className="text-5xl text-gray-500" />
              <span className="text-lg">スキップ</span>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const handleDragEnd = useCallback(async () => {
    const xValue = dragX.get();
    if (xValue > SWIPE_THRESHOLD) {
      await Promise.resolve(onSwipeRight());
    } else if (xValue < -SWIPE_THRESHOLD) {
      await Promise.resolve(onSwipeLeft());
    }
    dragX.stop();
    dragY.stop();
    dragX.set(0);
    dragY.set(0);
  }, [dragX, dragY, onSwipeRight, onSwipeLeft]);

  return (
    <div>
      <section
        style={{ pointerEvents: dragging ? "none" : undefined, height: "100%" }}
      >
        <motion.div
          drag
          dragElastic={0.9}
          dragListener={true}
          onDragStart={() => setDragging(true)}
          onDragEnd={() => {
            handleDragEnd();
            setDragging(false);
          }}
          style={{ x: dragX, y: dragY, padding: "10px" }}
          whileTap={{ scale: 0.95 }}
        >
          <CardOverlay />
          <Card
            displayedUser={displayedUser}
            currentUser={currentUser}
            setOpenDetailedMenu={setOpenDetailedMenu}
          />
        </motion.div>
      </section>
    </div>
  );
};
