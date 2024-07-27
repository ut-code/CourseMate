import express, { Request, Response } from "express";

const router = express.Router();

// requires body parser
router.get("/set-cookie", (req: Request, res: Response) => {
  const query = req.query;

  for (const key of Object.keys(query)) {
    res.cookie(key, String(query[key]), {
      httpOnly: true,
      sameSite: "none", // TODO: make it to `strict` on release
      maxAge: 5 * 60 * 1000,
      path: "/",
      secure: false,
    });
  }

  res.status(204).send();
});

export default router;
