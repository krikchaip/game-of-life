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

export type ParseOptions = { rows?: number; cols?: number }
export function parse(text: string, option?: ParseOptions) {
  if (!text)
    return {
      grid: { rows: option?.rows ?? 0, cols: option?.cols ?? 0 },
      population: {}
    }

  const grid = text
    .trim()
    .split(/\s{2,}/)
    .map(row => row.split(' '))

  const rows = grid.length
  const cols = grid.map(row => row.length).sort()[0] // minimum

  if (option?.rows && option.rows < rows)
    throw new Error(
      'option.rows must be greater or equal than the given text rows'
    )

  if (option?.cols && option.cols < cols)
    throw new Error(
      'option.cols must be greater or equal than the given text columns'
    )

  return {
    grid: { rows: option?.rows ?? rows, cols: option?.cols ?? cols },
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
    }, {} as Coordinates)
  }
}

export function entries(coordinates: Coordinates) {
  const results = []

  for (const rowIdx in coordinates) {
    for (const colIdx in coordinates[rowIdx]) {
      results.push([+rowIdx, +colIdx])
    }
  }

  return results
}

export function seed(rows: number, cols: number): GameState {
  const population: Coordinates = {}

  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (1 - Math.random() >= 0.3) continue
      if (!population[r]) population[r] = { [c]: true }
      else population[r][c] = true
    }

  return {
    grid: { rows, cols },
    population
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
        addCoordinate(surroundingSpaces, row.toString(), col.toString())
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

      addCoordinate(nextGen, rowIdx, colIdx)
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

      addCoordinate(nextGen, rowIdx, colIdx)
    }
  }

  return {
    grid,
    population: nextGen
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
      [row + 1, col + 1]
    ]
  }

  function outOfBound(row: number, col: number) {
    return row < 0 || row >= grid.rows || col < 0 || col >= grid.cols
  }

  function addCoordinate(coordinates: Coordinates, row: string, col: string) {
    if (!coordinates[row]) coordinates[row] = { [col]: true }
    else coordinates[row][col] = true
  }
}
