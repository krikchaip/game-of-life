import React from 'react'
import { render } from '@testing-library/react'
import { build, fake } from '@jackfranklin/test-data-bot'

import { GameState } from '../processor'
import Grid from '../grid'

const gridBuilder = build<GameState['grid']>('Grid', {
  fields: {
    rows: fake((f) => f.random.number({ min: 3, max: 100 })),
    cols: fake((f) => f.random.number({ min: 3, max: 100 })),
  },
})

it('render specified #rows and #cols accordingly', () => {
  const grid = gridBuilder()
  const { getByTestId } = render(
    <Grid rows={grid.rows} cols={grid.cols} marks={[]} />
  )

  const root = getByTestId('grid-root')

  expect(root).toHaveAttribute('rows', grid.rows.toString())
  expect(root).toHaveAttribute('cols', grid.cols.toString())
})
