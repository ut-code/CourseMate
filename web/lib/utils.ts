export function panic(reason: string): never {
  throw new Error(`function panic() called for reason: "${reason}"`);
}
