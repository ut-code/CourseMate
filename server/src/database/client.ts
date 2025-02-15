import { PrismaClient } from "@prisma/client";
import { format } from "sql-formatter";
import "../load-env";

const { SQL_LOG } = process.env;

export const prisma = new PrismaClient(
  SQL_LOG === "true"
    ? {
        log: [
          {
            emit: "event",
            level: "query",
          },
          {
            emit: "stdout",
            level: "error",
          },
          {
            emit: "stdout",
            level: "info",
          },
          {
            emit: "stdout",
            level: "warn",
          },
        ],
      }
    : undefined,
);

prisma.$on("query", (e) => {
  console.log(format(e.query, { language: "postgresql" }));
  console.log(`Params: ${e.params}`);
  console.log("\n");
});
