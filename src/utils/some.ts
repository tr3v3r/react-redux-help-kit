export function some<T>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => boolean,
): boolean {
  return Object.keys(obj).some(key => {
    return fn(obj[key], key);
  });
}
