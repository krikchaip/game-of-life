import React from 'react'
import styled from 'styled-components'

import { GameState, entries } from './processor'
import Grid from './grid'

function App() {
  const state: GameState = {
    grid: { cols: 20, rows: 20 },
    population: {
      '1': {
        '1': true,
        '2': true
      },
      '2': {
        '1': true,
        '2': true
      }
    }
  }
  return (
    <Scene>
      <Grid
        rows={state.grid.rows}
        cols={state.grid.cols}
        marks={entries(state.population)}
      />
    </Scene>
  )
}

const Scene = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  user-select: none;
`

export default App
