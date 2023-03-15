export function find<T>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => boolean,
): T | undefined {
  const foundKey = Object.keys(obj).find(key => {
    return fn(obj[key], key);
  });

  return obj[foundKey];
}
