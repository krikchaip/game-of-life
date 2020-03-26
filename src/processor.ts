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
  cellEvaluator(false, 0)
  return currentState
}
