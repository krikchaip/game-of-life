/** a placeholder function (do nothing) */
export const noop = () => {}

/** curried property access */
export const props = <T>(key: keyof T) => (obj: T) => obj[key]

/** finding maximum number in an array */
export const maximum = (arr: number[]) =>
  arr.reduce((x, y) => (x >= y ? x : y), -Infinity)

/** finding minimum number in an array */
export const minimum = (arr: number[]) =>
  arr.reduce((x, y) => (x <= y ? x : y), Infinity)
