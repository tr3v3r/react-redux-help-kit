export function mapValues(obj: any, fn: (value: any, key: string) => any): any {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = fn(obj[key], key);
    return acc;
  }, {});
}
