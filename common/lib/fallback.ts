export function fallback<T>(nullable: T | null, fallback: T): T {
  if (nullable == null) return fallback;
  return nullable;
}

export function lazyFallback<T>(nullable: T | null, fallbackFunc: () => T): T {
  if (nullable == null) return fallbackFunc();
  return nullable;
}

export async function lazyFallbackAsync<T>(
  nullable: T | null,
  asyncFallbackFunc: () => Promise<T>,
): Promise<T> {
  if (nullable != null) return nullable;
  return await asyncFallbackFunc();
}
