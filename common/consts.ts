import type { Day } from "./types";

export const DAY_TO_JAPANESE_MAP = new Map<Day, string>([
  ["mon", "月"],
  ["tue", "火"],
  ["wed", "水"],
  ["thu", "木"],
  ["fri", "金"],
  ["sat", "土"],
  ["sun", "日"],
]);

export const ACTIVE_DAYS = ["mon", "tue", "wed", "thu", "fri"] as const;

export const sortSlots = (
  slots: {
    day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun" | "other";
    period: number;
  }[],
) => {
  const order = ["mon", "tue", "wed", "thu", "fri", "sat", "sun", "other"];
  return slots.sort((a, b) => {
    const dayComparison = order.indexOf(a.day) - order.indexOf(b.day);
    if (dayComparison !== 0) {
      return dayComparison;
    }
    return a.period - b.period;
  });
};
