export function truncateStr(str: string, maxLength: number) {
  return str.length > maxLength ? `${str.slice(0, maxLength - 1)}...` : str;
}
