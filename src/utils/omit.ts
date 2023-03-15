export function omit<T, O extends Record<string, T>>(
  obj: O,
  keys: string[],
): Omit<O, typeof keys[number]> {
  return Object.keys(obj).reduce((acc, key) => {
    if (keys.includes(key)) {
      return acc;
    }
    return {...acc, [key]: obj[key]};
  }, {} as Omit<O, typeof keys[number]>);
}
