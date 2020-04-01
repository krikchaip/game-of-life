/** a placeholder function (do nothing) */
export const noop = () => {}

/** curried property access */
export const props = <T>(key: keyof T) => (obj: T) => obj[key]
