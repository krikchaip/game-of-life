import React, { useState } from 'react'
import styled from 'styled-components'

import * as processor from './processor'
import Grid from './grid'

type Props = {
  initialState?: processor.GameState
}

function App(props: Props) {
  const {
    initialState = {
      grid: { cols: 20, rows: 20 },
      population: {
        '1': {
          '2': true
        },
        '2': {
          '3': true
        },
        '3': {
          '1': true,
          '2': true,
          '3': true
        }
      }
    }
  } = props
  const [state, setState] = useState(initialState)

  function handleNextGeneration() {
    setState(processor.nextGeneration(state, processor.classicRule))
  }

  return (
    <Scene>
      <Actions>
        <Button onClick={handleNextGeneration}>next</Button>
      </Actions>
      <Grid
        rows={state.grid.rows}
        cols={state.grid.cols}
        marks={processor.entries(state.population)}
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
  flex-direction: column;

  user-select: none;
`

const Actions = styled.div`
  margin-bottom: 1rem;
`

const Button = styled.button`
  padding: 0.25rem 0.5rem;
  text-transform: uppercase;
  cursor: pointer;
`

export default App
