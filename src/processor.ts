export function shouldAlive(isAlive: boolean, neighbors: number) {
  if (neighbors < 0) throw new Error('neighbors must equals or greater than 0')

  if (neighbors < 2) return false
  if (neighbors === 2) return isAlive
  if (neighbors === 3) return true

  return false
}
