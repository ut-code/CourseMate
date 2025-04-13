// unexpected error
export function panic(reason: string): never {
  throw new Error(reason);
  // TODO: 型エラーとなるため一時的にコメントアウト
  // throw new Error(reason, {
  //   cause: "panic",
  // });
}
