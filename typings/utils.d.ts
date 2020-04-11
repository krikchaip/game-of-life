/**
 * Extract type `T` from `Array<T>`
 */
type ArrayElement<T> = T extends (infer U)[] ? U : never

/**
 * Make all properties from `T` nullable
 */
type Nullable<T> = { [k in keyof T]: T[k] | null }

/**
 * Extract value types from object `T`
 */
type Values<T> = T extends { [key in keyof T]: infer U } ? U : never
