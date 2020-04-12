import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import * as processor from './processor'
import Grid from './grid'
import Speed, { OPTION, Props as SpeedProps } from './speed'

type Props = {
  initialState?: processor.GameState
  config?: Config
}

type Config = { speed?: number }
type Autoplay = { active: boolean; interval?: number }

const SPEED_MAP: Record<string, (n: number) => number> = {
  [OPTION.SLOW]: n => n * 2,
  [OPTION.MEDIUM]: n => n,
  [OPTION.FAST]: n => n / 2
}

function App(props: Props) {
  const {
    initialState = {
      grid: { rows: 35, cols: 50 },
      population: {}
    },
    config = { speed: 500 }
  } = props

  const [state, setState] = useState(initialState)
  const [speed, setSpeed] = useState<keyof typeof OPTION>('MEDIUM')
  const [generations, setGenerations] = useState(1)
  const [autoplay, setAutoplay] = useState<Autoplay>({ active: false })

  useEffect(() => {
    return () => {
      clearInterval(autoplay.interval)
    }
  }, [autoplay])

  function handleNextGeneration() {
    setState(state => processor.nextGeneration(state, processor.classicRule))
    setGenerations(gen => gen + 1)
  }

  function handleAutoplay() {
    const intervalId = setInterval(() => {
      setState(state => processor.nextGeneration(state, processor.classicRule))
      setGenerations(gen => gen + 1)
    }, SPEED_MAP[OPTION[speed]](config.speed!))

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
    setGenerations(1)
  }

  function handleSpeedChange(
    value: Parameters<Exclude<SpeedProps['onChange'], undefined>>[0]
  ) {
    if (autoplay.active) {
      clearInterval(autoplay.interval)
      const intervalId = setInterval(() => {
        setState(state =>
          processor.nextGeneration(state, processor.classicRule)
        )
        setGenerations(gen => gen + 1)
      }, SPEED_MAP[OPTION[value]](config.speed!))
      setAutoplay(({ active }) => ({ active, interval: intervalId }))
    }

    setSpeed(value)
  }

  return (
    <Scene>
      <Container>
        <Menu>
          Generation: {generations}
          <span />
        </Menu>
        <Grid
          rows={state.grid.rows}
          cols={state.grid.cols}
          marks={processor.entries(state.population)}
        />
        <Actions>
          <Button onClick={handleRandom}>seed</Button>
          <Button onClick={handleNextGeneration}>next</Button>
          <Button
            onClick={autoplay.active ? handleStopAutoplay : handleAutoplay}
          >
            {autoplay.active ? 'stop' : 'play'}
          </Button>
          <Speed
            aria-label="select-speed"
            value={speed}
            onChange={handleSpeedChange}
          />
        </Actions>
      </Container>
    </Scene>
  )
}

const Scene = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  flex-direction: column;

  user-select: none;
`

const Container = styled.div`
  margin-top: 10vh;
`

const Menu = styled.div`
  margin-bottom: 0.5rem;

  display: flex;
  align-items: center;

  span {
    flex: 1;
  }
`

const Actions = styled.div`
  width: fit-content;
  margin: 1rem auto 0 auto;

  display: flex;
  align-items: center;

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
