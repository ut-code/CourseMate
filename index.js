import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const client = new PrismaClient();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  const users = await client.user.findMany();
  res.send(`All users: ${users.map((user) => user.name).join(", ")}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
