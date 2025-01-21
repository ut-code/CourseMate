import type { Day, User } from "common/types";

export const subjects: Array<{
  group: string;
  subjects: Array<[string]>;
}> = [
  {
    group: "Computer Science",
    subjects: [
      ["型システム"],
      ["機械学習"],
      ["CPU アーキテクチャ"],
      ["分散処理"],
    ] as const,
  },
  {
    group: "Math",
    subjects: [["Lean4"]],
  },
];
export const interest = [
  { userId: 101, subjectId: 1 },
  { userId: 102, subjectId: 1 },
  { userId: 103, subjectId: 1 },
  { userId: 101, subjectId: 2 },
  { userId: 101, subjectId: 3 },
  { userId: 102, subjectId: 2 },
  { userId: 102, subjectId: 4 },
  { userId: 103, subjectId: 3 },
  { userId: 103, subjectId: 4 },
];

export const users: User[] = [
  {
    id: 0,
    name: "メモ",
    gender: "メモ",
    grade: "メモ",
    faculty: "メモ",
    department: "メモ",
    intro: "メモです。",
    pictureUrl:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvpbYflYCwbG_c11ADWhZUaf93zrtmvYYjSvY4NNxcF4Ri-XO6jiFZq-1InXfcxBjTD9_8jQntvnzML5F0geA04H9etzy3dcZ7SaqpbfKX4PmFgg8nplhaSLBCWo6zOIwq-jJc9tjrXxKV/s1600/bunbougu_memo.png",
    guid: "0000",
  },
  {
    id: 101,
    name: "田中太郎",
    gender: "男",
    grade: "D2",
    faculty: "工学部",
    department: "電気電子工学科",
    intro: "田中太郎です。",
    pictureUrl:
      "https://firebasestorage.googleapis.com/v0/b/coursemate-tutorial.appspot.com/o/YdulS1s41LVh1nWgOBqzMiXN7803%2FtP5PrelZVe6v4UoF.jpg?alt=media&token=252da169-cccb-45b3-bec6-946ec3de3e27",
    guid: "abc101",
  },
  {
    id: 102,
    name: "山田花子",
    gender: "女",
    grade: "B2",
    faculty: "経済学部",
    department: "経営学科",
    intro: "山田花子です。",
    pictureUrl:
      "https://firebasestorage.googleapis.com/v0/b/coursemate-tutorial.appspot.com/o/45QiYkH65OWHZYPruT9sHKAHa4I3%2FulavVaTxMNACkcn4.jpg?alt=media&token=6eea4c9f-c9ec-4c6e-943b-96b0afe013c3",
    guid: "abc102",
  },
  {
    id: 103,
    name: "小五郎",
    gender: "男",
    grade: "B3",
    faculty: "経済学部",
    department: "経営学科",
    intro: "小五郎です。",
    pictureUrl:
      "https://firebasestorage.googleapis.com/v0/b/coursemate-tutorial.appspot.com/o/45QiYkH65OWHZYPruT9sHKAHa4I3%2FulavVaTxMNACkcn4.jpg?alt=media&token=6eea4c9f-c9ec-4c6e-943b-96b0afe013c3",
    guid: "abc103",
  },
];

export const courses = [
  {
    id: "10001",
    name: "国語八列",
    teacher: "八十島漕郎",
  },
  {
    id: "10002",
    name: "数学八列",
    teacher: "八十島漕郎",
  },
  {
    id: "10003",
    name: "英語八列",
    teacher: "八十島漕郎",
  },
  {
    id: "10004",
    name: "理科八列",
    teacher: "八十島漕郎",
  },
  {
    id: "10005",
    name: "社会八列",
    teacher: "八十島漕郎",
  },
];

export const slots: Array<{ courseId: string; day: Day; period: number }> = [
  {
    courseId: "10001",
    day: "tue",
    period: 4,
  },
  {
    courseId: "10001",
    day: "thu",
    period: 4,
  },
  {
    courseId: "10002",
    day: "mon",
    period: 3,
  },
  {
    courseId: "10003",
    day: "mon",
    period: 3,
  },
  {
    courseId: "10003",
    day: "wed",
    period: 3,
  },
  {
    courseId: "10004",
    day: "wed",
    period: 3,
  },
  {
    courseId: "10004",
    day: "fri",
    period: 3,
  },
  {
    courseId: "10005",
    day: "tue",
    period: 2,
  },
  {
    courseId: "10005",
    day: "tue",
    period: 3,
  },
];

export const enrollments: Array<[number, string]> = [
  // assert: 101 and 102 has more overlaps in courses than 101 and 103, but less than 102 and 103
  // if you change the assertion above, fix test in engines/recommendation.test.ts too.
  [101, "10001"],
  [101, "10002"],
  [101, "10003"],
  [102, "10002"],
  [102, "10003"],
  [102, "10004"],
  [102, "10005"],
  [103, "10003"],
  [103, "10004"],
  [103, "10005"],
];
