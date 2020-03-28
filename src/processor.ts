export function shouldAlive(isAlive: boolean, neighbors: number) {
  if (neighbors < 0) throw new Error('neighbors must equals or greater than 0')

  if (neighbors < 2) return false
  if (neighbors === 2) return isAlive
  if (neighbors === 3) return true

  return false
}

export function readState(currentState: boolean[][]) {
  return (
    currentState.reduce(
      (acc, curr) => acc + '\n' + curr.map((s) => (s ? 'o' : 'x')).join(' '),
      ''
    ) + '\n'
  )
}

export function parseState(stateString: string) {
  return stateString
    .trim()
    .split(/\s{2,}/)
    .map((row) =>
      row.split(' ').map((c) => {
        switch (c) {
          case 'x':
            return false
          case 'o':
            return true
          default:
            throw new Error(
              "character must be only either 'x' or 'o' with single space between."
            )
        }
      })
    )
}

export function nextState(
  currentState: boolean[][],
  cellEvaluator: (isAlive: boolean, neighbors: number) => boolean
) {
  // target to check with `cellEvaluator` function
  const aliveTargets: { [rowIdx: number]: Set<number> } = {}
  const deadTargets: { [rowIdx: number]: Set<number> } = {}

  // mark living cells
  currentState.forEach((row, r) => {
    row.forEach((col, c) => {
      if (col) {
        if (!aliveTargets[r]) return (aliveTargets[r] = new Set([c]))
        return aliveTargets[r].add(c)
      }
    })
  })

  // mark surrounding spaces
  Object.keys(aliveTargets).forEach((rowIdx: any) => {
    aliveTargets[rowIdx].forEach((colIdx) => {
      const surroundings = [
        [+rowIdx - 1, colIdx - 1],
        [+rowIdx - 1, colIdx],
        [+rowIdx - 1, colIdx + 1],
        [+rowIdx, colIdx - 1],
        [+rowIdx, colIdx + 1],
        [+rowIdx + 1, colIdx - 1],
        [+rowIdx + 1, colIdx],
        [+rowIdx + 1, colIdx + 1],
      ]

      surroundings.forEach(([r, c]) => {
        const value = currentState[r]?.[c]
        if (typeof value === 'undefined' || value) return
        if (!deadTargets[r]) return (deadTargets[r] = new Set([c]))
        return deadTargets[r].add(c)
      })
    })
  })

  // new alive targets to save in currentState
  const newTargets: { [rowIdx: number]: { [colIdx: number]: boolean } } = {}

  // update living cell targets
  Object.keys(aliveTargets).forEach((rowIdx: any) => {
    aliveTargets[rowIdx].forEach((colIdx) => {
      let neighbors = 0
      const surroundings = [
        [+rowIdx - 1, colIdx - 1],
        [+rowIdx - 1, colIdx],
        [+rowIdx - 1, colIdx + 1],
        [+rowIdx, colIdx - 1],
        [+rowIdx, colIdx + 1],
        [+rowIdx + 1, colIdx - 1],
        [+rowIdx + 1, colIdx],
        [+rowIdx + 1, colIdx + 1],
      ]

      surroundings.forEach(([r, c]) => {
        const value = currentState[r]?.[c]
        if (typeof value === 'undefined' || !value) return
        neighbors++
      })

      const newState = cellEvaluator(currentState[rowIdx][colIdx], neighbors)

      if (!newTargets[rowIdx])
        return (newTargets[rowIdx] = { [colIdx]: newState })
      return (newTargets[rowIdx][colIdx] = newState)
    })
  })

  // update dead cell targets
  Object.keys(deadTargets).forEach((rowIdx: any) => {
    deadTargets[rowIdx].forEach((colIdx) => {
      let neighbors = 0
      const surroundings = [
        [+rowIdx - 1, colIdx - 1],
        [+rowIdx - 1, colIdx],
        [+rowIdx - 1, colIdx + 1],
        [+rowIdx, colIdx - 1],
        [+rowIdx, colIdx + 1],
        [+rowIdx + 1, colIdx - 1],
        [+rowIdx + 1, colIdx],
        [+rowIdx + 1, colIdx + 1],
      ]

      surroundings.forEach(([r, c]) => {
        const value = currentState[r]?.[c]
        if (typeof value === 'undefined' || !value) return
        neighbors++
      })

      const newState = cellEvaluator(currentState[rowIdx][colIdx], neighbors)

      if (!newTargets[rowIdx])
        return (newTargets[rowIdx] = { [colIdx]: newState })
      return (newTargets[rowIdx][colIdx] = newState)
    })
  })

  Object.keys(newTargets).forEach((row: any) => {
    Object.keys(newTargets[row]).forEach((col: any) => {
      currentState[row][col] = newTargets[row][col]
    })
  })

  return currentState
}
