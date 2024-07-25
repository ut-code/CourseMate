import express from "express";
import { asyncMust } from "./must-satisfy";
import { isLoggedIn } from "../firebase/auth/lib";

const ok = true;
const bad = false;

// requires cookieParser before this middleware.
// NOTE: applying this doesn't make sure all request JSONs are valid.
// it just makes sure the request is from a valid user s.t. the error log is flooded with console.error("user not logged in");
const mustBeLoggedIn = asyncMust(
  async (req: express.Request) => {
    const loggedIn: boolean = await isLoggedIn(req);

    if (loggedIn) return ok;
    return bad;
  },
  function onerror(res: express.Response) {
    res.status(401).send("must be logged in");
  },
);

export default mustBeLoggedIn;
