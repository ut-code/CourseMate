import type { Request, Response } from "express";

export function must(
  validate: (req: Request) => boolean,
  onError: ((res: Response) => void | Promise<void>) | string,
): (req: Request, res: Response, next: () => void) => void {
  return function (req: Request, res: Response, next: () => void) {
    if (!validate(req)) {
      if (typeof onError === "string") {
        res.send(onError);
      } else {
        onError(res);
      }
      return;
    }
    next();
  };
}

export function asyncMust(
  validate: (req: Request) => Promise<boolean>,
  onError: ((res: Response) => void | Promise<void>) | string,
): (req: Request, res: Response, next: () => void) => void {
  return function (req: Request, res: Response, next: () => void) {
    validate(req)
      .then((ok) => {
        if (ok) next();
        else throw new Error("reject");
      })
      .catch(() => {
        if (typeof onError === "string") {
          res.send(onError);
        } else {
          onError(res);
        }
      });
  };
}

export default {
  must,
  asyncMust,
};
