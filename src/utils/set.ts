export function set(obj: any, path: string[], value: any): any {
  const [first, ...rest] = path;

  if (rest.length === 0) {
    return {
      ...obj,
      [first]: value,
    };
  }

  return {
    ...obj,
    [first]: set(obj[first], rest, value),
  };
}
