export default async function asyncMap<T, U>(
  data: T[],
  asyncFunc: (v: T) => Promise<U>,
): Promise<U[]> {
  const promises: Array<Promise<U>> = [];
  for (const el of data) {
    promises.push(asyncFunc(el));
  }
  return Promise.all(promises);
}
