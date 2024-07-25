import express, { Request, Response } from "express";

const router = express.Router();

// requires body parser
router.get("/set-cookie", (req: Request, res: Response) => {
  const body = req.body;

  for (const key of Object.keys(body)) {
    res.cookie(key, String(body[key]));
  }

  res.status(204).end();
});

export default router;
