const subjects = [
  {
    group: "Computer Science",
    subjects: ["機械学習", "CPU アーキテクチャ", "型システム", "分散処理"],
  },
  {
    group: "Math",
    subjects: ["Lean4"],
  },
];

export default subjects satisfies Array<{ group: string; subjects: string[] }>;
