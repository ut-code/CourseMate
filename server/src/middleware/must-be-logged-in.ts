import express from "express";
import mustSatisfy from "./must-satisfy";

const maxAge = 5 * 1000; // its unit is ms in express.

// requires cookieParser before this middleware.
const mustBeLoggedIn = mustSatisfy((req: express.Request) => {
  if (typeof req.cookies.id !== "string" || typeof req.cookies.session !== "string") {
    return false
  }
  // TODO: use req.cookies.id and req.cookies.session to check if user is logged in
  // (or just requiring existence of the cookies is also fine)
  // probably requires some kind of DB conn.
  // it probably won't be really efficient, so cache or make a JWT or smth

  return true;
}, function(res: express.Response) {
  // TODO: res.redirect(302, "http://localhost:3000/path/to/login/page");
  res.cookie("id", "you are", { maxAge });
  res.cookie("session", "not logged in", { maxAge });
  res.send("granted cookie");
});

export default mustBeLoggedIn;
