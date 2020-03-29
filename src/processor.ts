export type Grid = { rows: number; cols: number }

/** represents coordinate system in the game */
export type Coordinates = {
  [rowIdx: string]: {
    [colIdx: string]: true
  }
}

export type GameState = {
  grid: Grid
  population: Coordinates
}

/** determine whether space should be populated from current status and neighbors */
export type GameRule = (populated: boolean, neighbors: number) => boolean

export const classicRule: GameRule = (
  populated: boolean,
  neighbors: number
) => {
  if (neighbors < 0) throw new Error('neighbors must equals or greater than 0')

  if (neighbors < 2) return false
  if (neighbors === 2) return populated
  if (neighbors === 3) return true

  return false
}

export function stringify(state: GameState) {
  const { grid, population } = state

  let result = ''

  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const char = population[row]?.[col] ? 'o' : 'x'
      const sep = col < grid.cols - 1 ? ' ' : '\n'
      result += char + sep
    }
  }

  result = '\n' + result

  return result
}

export function parse(text: string) {
  const grid = text
    .trim()
    .split(/\s{2,}/)
    .map((row) => row.split(' '))

  const rows = grid.length
  const cols = grid.map((row) => row.length).sort()[0]

  return {
    grid: { rows, cols },
    population: grid.reduce((acc, row, rowIdx) => {
      for (let colIdx = 0; colIdx < cols; colIdx++) {
        switch (row[colIdx]) {
          case 'x':
            break
          case 'o':
            if (!acc[rowIdx]) acc[rowIdx] = { [colIdx]: true }
            else acc[rowIdx][colIdx] = true
            break
          default:
            throw new Error(
              "character must be only either 'x' or 'o' with single space between."
            )
        }
      }
      return acc
    }, {} as Coordinates),
  }
}

export function nextGeneration(
  currentState: GameState,
  rule: GameRule
): GameState {
  const { grid, population } = currentState
  const surroundingSpaces: Coordinates = {}
  const nextGen: Coordinates = {}

  // mark surrounding spaces
  for (const rowIdx in population) {
    for (const colIdx in population[rowIdx]) {
      getSurroundingPoints(+rowIdx, +colIdx).forEach(([row, col]) => {
        if (outOfBound(row, col)) return
        if (population[row]?.[col]) return
        if (!surroundingSpaces[row]) surroundingSpaces[row] = { [col]: true }
        else surroundingSpaces[row][col] = true
      })
    }
  }

  // determine surrounding spaces whether they should populate
  for (const rowIdx in surroundingSpaces) {
    for (const colIdx in surroundingSpaces[rowIdx]) {
      let neighbors = 0

      getSurroundingPoints(+rowIdx, +colIdx).forEach(([row, col]) => {
        if (outOfBound(row, col)) return
        if (population[row]?.[col]) neighbors++
      })

      if (!rule(false, neighbors)) continue

      if (!nextGen[rowIdx]) nextGen[rowIdx] = { [colIdx]: true }
      else nextGen[rowIdx][colIdx] = true
    }
  }

  // determine whether existing population should survives
  for (const rowIdx in population) {
    for (const colIdx in population[rowIdx]) {
      let neighbors = 0

      getSurroundingPoints(+rowIdx, +colIdx).forEach(([row, col]) => {
        if (outOfBound(row, col)) return
        if (population[row]?.[col]) neighbors++
      })

      if (!rule(true, neighbors)) continue

      if (!nextGen[rowIdx]) nextGen[rowIdx] = { [colIdx]: true }
      else nextGen[rowIdx][colIdx] = true
    }
  }

  return {
    grid,
    population: nextGen,
  }

  function getSurroundingPoints(row: number, col: number) {
    return [
      [row - 1, col - 1],
      [row - 1, col],
      [row - 1, col + 1],
      [row, col - 1],
      [row, col + 1],
      [row + 1, col - 1],
      [row + 1, col],
      [row + 1, col + 1],
    ]
  }

  function outOfBound(row: number, col: number) {
    return row < 0 || row >= grid.rows || col < 0 || col >= grid.cols
  }
}
