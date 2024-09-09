export type HTTPResult<T> = {
  code: number;
  ok: true;
  body: T;
} | {
  code: number;
  ok: false;
  body: string;
};
