export function panic(reason: string): never {
  throw new Error(`function panic() called for reason: "${reason}"`);
}

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
