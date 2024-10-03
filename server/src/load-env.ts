import * as dotenv from "dotenv";

const path = process.env.ENV_FILE ?? ".env.dev";

function main() {
  if (process.env.NEVER_LOAD_DOTENV) return;
  dotenv.config({ path });
}
main();

export function assertLocalDB() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (DATABASE_URL !== "postgres://user:password@localhost:5432/database") {
    console.log(
      "SAFETY GUARD: test must be run via `make test`, otherwise it might break dev/prod database",
    );
    throw new Error(`got: \`${DATABASE_URL}\``);
  }
}
