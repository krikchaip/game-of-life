import { useState, useEffect, ChangeEvent } from 'react'

import * as processor from '~/processor'
import Grid from '~/grid'
import Speed, { OPTION, Props as SpeedProps } from '~/speed'

type Props = {
  initialState?: processor.GameState
  config?: Config
}

type Config = { speed?: number; pattern?: Values<typeof PATTERNS> }
type Autoplay = { active: boolean; interval?: number }

const SPEED_MAP: Record<string, (n: number) => number> = {
  [OPTION.SLOW]: n => n * 2,
  [OPTION.MEDIUM]: n => n,
  [OPTION.FAST]: n => n / 2
}

export const PATTERNS = {
  EMPTY: { value: '', label: 'Empty', grid: `` },
  GLIDER: {
    value: 'GLIDER',
    label: 'Glider',
    grid: `
      x x o
      o x o
      x o o
    `
  },
  LWSS: {
    value: 'LWSS',
    label: 'Light-weight spaceship',
    grid: `
      x o x x o
      o x x x x
      o x x x o
      o o o o x
    `
  },
  HWSS: {
    value: 'HWSS',
    label: 'Heavy-weight spaceship',
    grid: `
      x x x o o x x
      x o x x x x o
      o x x x x x x
      o x x x x x o
      o o o o o o x
    `
  },
  BLINKER: {
    value: 'BLINKER',
    label: 'Blinker',
    grid: `
      x o x
      x o x
      x o x
    `
  },
  TOAD: {
    value: 'TOAD',
    label: 'Toad',
    grid: `
      x o o o
      o o o x
    `
  },
  BEACON: {
    value: 'BEACON',
    label: 'Beacon',
    grid: `
      o o x x
      o o x x
      x x o o
      x x o o
    `
  },
  PULSAR: {
    value: 'PULSAR',
    label: 'Pulsar',
    grid: `
      x x o o o x x x o o o x x
      x x x x x x x x x x x x x
      o x x x x o x o x x x x o
      o x x x x o x o x x x x o
      o x x x x o x o x x x x o
      x x o o o x x x o o o x x
      x x x x x x x x x x x x x
      x x o o o x x x o o o x x
      o x x x x o x o x x x x o
      o x x x x o x o x x x x o
      o x x x x o x o x x x x o
      x x x x x x x x x x x x x
      x x o o o x x x o o o x x
    `
  },
  PENTA: {
    value: 'PENTA',
    label: 'Penta-decathlon',
    grid: `
      x x o x x x x o x x
      o o x o o o o x o o
      x x o x x x x o x x
    `
  }
}

const defaultProps = (ptn: Values<typeof PATTERNS>) => {
  const grid = { rows: 35, cols: 50 }
  return {
    initialState: processor.parse(ptn.grid, { ...grid, center: true }),
    config: {
      speed: 500,
      pattern: ptn
    }
  }
}

function App(props: Props) {
  const { initialState, config } = {
    ...defaultProps(PATTERNS.GLIDER),
    ...props
  }

  const [state, setState] = useState(initialState)
  const [speed, setSpeed] = useState<keyof typeof OPTION>('MEDIUM')
  const [generations, setGenerations] = useState(1)
  const [pattern, setPattern] = useState(PATTERNS.GLIDER)
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

  function handlePatternSelect(e: ChangeEvent<HTMLSelectElement>) {
    const ptn = PATTERNS[e.target.value as keyof typeof PATTERNS]
    setState(({ grid }) => processor.parse(ptn.grid, { ...grid, center: true }))
    setPattern(ptn)
    setGenerations(1)
  }

  return (
    <div className="flex h-screen w-screen select-none flex-col items-center bg-[#f0f0f0]">
      <div className="mt-[7.5vh]">
        <div className="mb-8 text-center">
          <div className="text-5xl">Convey&apos;s Game of Life</div>
          <div className="text-xs">created by: krikchaip</div>
        </div>
        <div className="mb-2 flex items-center">
          <span>Generation: {generations}</span>
          <span style={{ flex: 1 }} />
          <select
            aria-label="select-pattern"
            value={pattern.value}
            onChange={handlePatternSelect}
          >
            {Object.entries(PATTERNS).map(([name, option], idx) => (
              <option value={name} key={idx}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <Grid
          rows={state.grid.rows}
          cols={state.grid.cols}
          marks={processor.entries(state.population)}
        />
        <div className="mx-auto mt-4 mb-0 flex w-fit items-center space-x-4">
          <button></button>
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
        </div>
      </div>
    </div>
  )
}

const Button = (props: JSX.IntrinsicElements['button']) => (
  <button className="cursor-pointer py-1 px-2 uppercase" {...props} />
)

export default App
