import express, { Request, Response } from "express";

const router = express.Router();

// requires body parser
router.get("/set-cookie", (req: Request, res: Response) => {
  const query = req.query;

  for (const key of Object.keys(query)) {
    res.cookie(key, String(query[key]), {
      httpOnly: true,
    });
  }

  res.status(204).end();
});

export default router;
