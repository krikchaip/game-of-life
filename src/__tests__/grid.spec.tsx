import { render } from '@testing-library/react'
import { build, fake } from '@jackfranklin/test-data-bot'

import { GameState, entries } from '~/processor'
import Grid from '~/grid'

const stateBuilder = (): GameState => {
  const GRID_LIMIT = { min: 3, max: 20 }
  const gridBuilder = build<GameState['grid']>('Grid', {
    fields: {
      rows: fake(f => f.random.number(GRID_LIMIT)),
      cols: fake(f => f.random.number(GRID_LIMIT))
    }
  })
  const grid = gridBuilder()

  const population: GameState['population'] = {}
  const randRows = grid.rows
  const randCols = grid.cols

  for (let r = 0; r < randRows; r++)
    for (let c = 0; c < randCols; c++)
      if (population[r.toString()])
        population[r.toString()][c.toString()] = true
      else population[r.toString()] = { [c.toString()]: true }

  return {
    grid,
    population
  }
}

it('render specified #rows and #cols accordingly', () => {
  const { grid } = stateBuilder()
  const { getByTestId } = render(
    <Grid rows={grid.rows} cols={grid.cols} marks={[]} />
  )

  const root = getByTestId('grid-root')

  expect(root).toHaveStyle({
    '--rows': grid.rows.toString(),
    '--cols': grid.cols.toString()
  })
})

it('render cells which #cells <= #rows * #cols', () => {
  const { grid, population } = stateBuilder()
  const marks = entries(population)
  const { getByTestId } = render(
    <Grid rows={grid.rows} cols={grid.cols} marks={marks} />
  )

  const root = getByTestId('grid-root')

  expect(root.children).toHaveLength(marks.length)
  expect(root.children.length).toBeLessThanOrEqual(grid.rows * grid.cols)
})

it('place cells on its position', () => {
  const { grid, population } = stateBuilder()
  const marks = entries(population)
  const { getByTestId } = render(
    <Grid rows={grid.rows} cols={grid.cols} marks={marks} />
  )

  const root = getByTestId('grid-root')
  let child = root.firstElementChild

  expect(child).toHaveStyle({
    gridRow: marks[0][0] + 1,
    gridColumn: marks[0][1] + 1
  })

  child = root.lastElementChild
  expect(child).toHaveStyle({
    gridRow: marks[marks.length - 1][0] + 1,
    gridColumn: marks[marks.length - 1][1] + 1
  })
})
