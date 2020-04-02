import React from 'react'
import { render } from '@testing-library/react'
import { build, fake } from '@jackfranklin/test-data-bot'

import { GameState, entries } from '../processor'
import Grid from '../grid'

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

  expect(root).toHaveAttribute('rows', grid.rows.toString())
  expect(root).toHaveAttribute('cols', grid.cols.toString())
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
