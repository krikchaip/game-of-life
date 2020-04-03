import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import * as processor from './processor'
import Grid from './grid'

type Props = {
  initialState?: processor.GameState
  config?: Config
}

type Config = { speed?: number }
type Autoplay = { active: boolean; interval?: number }

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
    },
    config = { speed: 500 }
  } = props

  const [state, setState] = useState(initialState)
  const [autoplay, setAutoplay] = useState<Autoplay>({ active: false })

  useEffect(() => {
    return () => {
      clearInterval(autoplay.interval)
    }
  }, [autoplay])

  function handleNextGeneration() {
    setState(state => processor.nextGeneration(state, processor.classicRule))
  }

  function handleAutoplay() {
    const intervalId = setInterval(() => {
      setState(state => processor.nextGeneration(state, processor.classicRule))
    }, config.speed)

    setAutoplay(autoplay => ({
      active: !autoplay.active,
      interval: intervalId
    }))
  }

  function handleStopAutoplay() {
    clearInterval(autoplay.interval)
    setAutoplay(autoplay => ({ active: !autoplay.active }))
  }

  function handleRandom() {
    setState(state => processor.seed(state.grid.rows, state.grid.cols))
  }

  return (
    <Scene>
      <Grid
        rows={state.grid.rows}
        cols={state.grid.cols}
        marks={processor.entries(state.population)}
      />
      <Actions>
        <Button onClick={handleNextGeneration}>next</Button>
        <Button onClick={autoplay.active ? handleStopAutoplay : handleAutoplay}>
          {autoplay.active ? 'stop' : 'play'}
        </Button>
        <Button onClick={handleRandom}>seed</Button>
      </Actions>
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
  margin-top: 1rem;
  display: flex;

  > :not(:last-child) {
    margin-right: 1rem;
  }
`

const Button = styled.button`
  padding: 0.25rem 0.5rem;
  text-transform: uppercase;
  cursor: pointer;
`

export default App
