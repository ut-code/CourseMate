import type { Request, Response } from "express";

function must(
  boolFunc: (req: Request) => boolean,
  onError: ((res: Response) => void) | string,
): (req: Request, res: Response, next: () => void) => void {
  return function (req: Request, res: Response, next: () => void) {
    if (!boolFunc(req)) {
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

export default must;
