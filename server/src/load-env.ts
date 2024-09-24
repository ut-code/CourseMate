import * as dotenv from "dotenv";

const path = process.env.ENV_FILE ?? ".env.dev";

function main() {
  if (process.env.NEVER_LOAD_DOTENV) return;
  dotenv.config({ path });
}
main();
