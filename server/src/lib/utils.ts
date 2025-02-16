import { panic } from "common/lib/panic";
export { panic } from "common/lib/panic";

export function allUrlMustBeValid(urls: string[]) {
  for (const url of urls) {
    try {
      new URL(url);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export function env(name: string) {
  return process.env[name] || panic(`env ${name} is missing`);
}
