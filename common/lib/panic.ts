// unexpected error
export function panic(reason: string): never {
  throw new Error(reason, {
    cause: "panic",
  });
}

// expected error
export function error(reason: string, code?: number): never {
  throw new Error(reason, { cause: code });
}
