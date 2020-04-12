import React from 'react'
import user from '@testing-library/user-event'
import { render, act, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'

import { noop } from '@lib/utils'
import * as processor from '../processor'
import App, { PATTERNS } from '../app'
import { OPTION } from '../speed'

it('render successfully', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(noop)

  expect(() => render(<App />)).not.toThrow()
  expect(console.error).not.toBeCalled()

  spy.mockRestore()
})

it('no axe violations', async () => {
  const { container } = render(<App />)
  const results = await axe(container)

  expect(results).toHaveNoViolations()
})

describe('game', () => {
  const state = processor.parse(`
    x x x x x
    x o o o x
    x x x x x
  `)

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('next generation', () => {
    jest.spyOn(processor, 'nextGeneration')

    const { getByText, getByTestId } = render(<App initialState={state} />)
    const next = getByText(/next/i)
    const grid = getByTestId('grid-root')

    expect(processor.nextGeneration).not.toBeCalled()

    user.click(next)

    expect(processor.nextGeneration).toBeCalledTimes(1)
    expect(processor.nextGeneration).toBeCalledWith(state, expect.any(Function))
    expect([...grid.children].map(c => c.getAttribute('style')))
      .toMatchInlineSnapshot(`
        Array [
          "grid-row: 1; grid-column: 3;",
          "grid-row: 2; grid-column: 3;",
          "grid-row: 3; grid-column: 3;",
        ]
      `)
  })

  describe('autoplay', () => {
    const config = { speed: 1000 }
    const nextState = processor.parse(`
      x x o x x
      x x o x x
      x x o x x
    `)

    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('start', () => {
      jest.spyOn(processor, 'nextGeneration')
      jest.spyOn(console, 'error')

      const { getByText, getByTestId, unmount } = render(
        <App initialState={state} config={config} />
      )

      const play = getByText(/play/i)
      const grid = getByTestId('grid-root')

      user.click(play)

      expect(processor.nextGeneration).not.toBeCalled()

      act(() => void jest.advanceTimersByTime(config.speed))
      expect(processor.nextGeneration).toBeCalledTimes(1)
      expect(processor.nextGeneration).toBeCalledWith(
        state,
        expect.any(Function)
      )
      expect([...grid.children].map(c => c.getAttribute('style')))
        .toMatchInlineSnapshot(`
          Array [
            "grid-row: 1; grid-column: 3;",
            "grid-row: 2; grid-column: 3;",
            "grid-row: 3; grid-column: 3;",
          ]
        `)

      act(() => void jest.advanceTimersByTime(config.speed))
      expect(processor.nextGeneration).toBeCalledTimes(2)
      expect(processor.nextGeneration).toBeCalledWith(
        nextState,
        expect.any(Function)
      )
      expect([...grid.children].map(c => c.getAttribute('style')))
        .toMatchInlineSnapshot(`
          Array [
            "grid-row: 2; grid-column: 2;",
            "grid-row: 2; grid-column: 3;",
            "grid-row: 2; grid-column: 4;",
          ]
        `)

      unmount()
      act(() => void jest.runOnlyPendingTimers())
      expect(console.error).not.toBeCalled()
    })

    it('stop', () => {
      jest.spyOn(processor, 'nextGeneration')

      const { getByText } = render(<App initialState={state} config={config} />)
      const play = getByText(/play/i)
      const timerCountBefore = jest.getTimerCount()

      user.click(play)

      expect(play).toHaveTextContent(/stop/i)

      act(() => void jest.advanceTimersByTime(config.speed))
      act(() => void jest.advanceTimersByTime(config.speed))

      user.click(play)

      expect(play).toHaveTextContent(/play/i)
      expect(jest.getTimerCount()).toBe(timerCountBefore)

      jest.runOnlyPendingTimers()
      expect(processor.nextGeneration).not.toBeCalledTimes(3)
    })
  })

  it('random', () => {
    jest.spyOn(processor, 'seed').mockReturnValue(
      processor.parse(`
        x x x x
        x o x o
        o x o o
      `)
    )

    const { getByText, getByTestId } = render(<App initialState={state} />)
    const random = getByText(/seed/i)
    const grid = getByTestId('grid-root')

    user.click(random)

    expect(processor.seed).toBeCalledWith(state.grid.rows, state.grid.cols)
    expect([...grid.children].map(c => c.getAttribute('style')))
      .toMatchInlineSnapshot(`
        Array [
          "grid-row: 2; grid-column: 2;",
          "grid-row: 2; grid-column: 4;",
          "grid-row: 3; grid-column: 1;",
          "grid-row: 3; grid-column: 3;",
          "grid-row: 3; grid-column: 4;",
        ]
      `)
  })

  describe('select speed', () => {
    const config = { speed: 1000 }

    beforeAll(() => {
      jest.useFakeTimers()
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    afterEach(() => {
      jest.clearAllTimers()
    })

    it('slow   = config * 2', () => {
      jest.spyOn(processor, 'nextGeneration')

      const { getByLabelText, getByText } = render(
        <App initialState={state} config={config} />
      )

      const selectSpeed = getByLabelText(/select-speed/i)
      const play = getByText(/play/i)

      fireEvent.change(selectSpeed, { target: { value: OPTION.SLOW } })
      user.click(play)

      expect(processor.nextGeneration).not.toBeCalled()

      act(() => void jest.advanceTimersByTime(config.speed * 2))
      expect(processor.nextGeneration).toBeCalledTimes(1)

      act(() => void jest.advanceTimersByTime(config.speed))
      expect(processor.nextGeneration).toBeCalledTimes(1)

      act(() => void jest.advanceTimersByTime(config.speed))
      expect(processor.nextGeneration).toBeCalledTimes(2)
    })

    it('medium = config', () => {
      jest.spyOn(processor, 'nextGeneration')

      const { getByLabelText, getByText } = render(
        <App initialState={state} config={config} />
      )

      const selectSpeed = getByLabelText(/select-speed/i)
      const play = getByText(/play/i)

      fireEvent.change(selectSpeed, { target: { value: OPTION.MEDIUM } })
      user.click(play)

      expect(processor.nextGeneration).not.toBeCalled()

      act(() => void jest.advanceTimersByTime(config.speed))
      expect(processor.nextGeneration).toBeCalledTimes(1)
    })

    it('fast   = config / 2', () => {
      jest.spyOn(processor, 'nextGeneration')

      const { getByLabelText, getByText } = render(
        <App initialState={state} config={config} />
      )

      const selectSpeed = getByLabelText(/select-speed/i)
      const play = getByText(/play/i)

      fireEvent.change(selectSpeed, { target: { value: OPTION.FAST } })
      user.click(play)

      expect(processor.nextGeneration).not.toBeCalled()

      act(() => void jest.advanceTimersByTime(config.speed / 2))
      expect(processor.nextGeneration).toBeCalledTimes(1)
    })

    it('while playing', () => {
      jest.spyOn(processor, 'nextGeneration')

      const { getByLabelText, getByText } = render(
        <App initialState={state} config={config} />
      )

      const selectSpeed = getByLabelText(/select-speed/i)
      const play = getByText(/play/i)

      user.click(play)

      expect(processor.nextGeneration).not.toBeCalled()

      act(() => void jest.advanceTimersByTime(config.speed))
      expect(processor.nextGeneration).toBeCalledTimes(1)

      fireEvent.change(selectSpeed, { target: { value: OPTION.FAST } })
      act(() => void jest.advanceTimersByTime(config.speed / 2))
      expect(processor.nextGeneration).toBeCalledTimes(2)

      fireEvent.change(selectSpeed, { target: { value: OPTION.SLOW } })
      act(() => void jest.advanceTimersByTime(config.speed * 2))
      expect(processor.nextGeneration).toBeCalledTimes(3)
    })
  })

  describe('generation update', () => {
    it('from clicking next', () => {
      const { getByText } = render(<App initialState={state} />)
      const gen = getByText(/generation/i)
      const next = getByText(/next/i)

      expect(gen).toHaveTextContent(/generation(.*)1/i)

      user.click(next)
      expect(gen).toHaveTextContent(/generation(.*)2/i)

      user.click(next)
      expect(gen).toHaveTextContent(/generation(.*)3/i)
    })

    it('from autoplay', () => {
      jest.useFakeTimers()

      const config = { speed: 1000 }
      const { getByText } = render(<App initialState={state} config={config} />)

      const gen = getByText(/generation/i)
      const play = getByText(/play/i)

      expect(gen).toHaveTextContent(/generation(.*)1/i)

      user.click(play)

      act(() => void jest.advanceTimersByTime(config.speed))
      expect(gen).toHaveTextContent(/generation(.*)2/i)

      act(() => void jest.advanceTimersByTime(config.speed))
      expect(gen).toHaveTextContent(/generation(.*)3/i)

      jest.clearAllTimers()
      jest.useRealTimers()
    })

    it('from changing speed during autoplay', () => {
      jest.useFakeTimers()

      const config = { speed: 1000 }
      const { getByText, getByLabelText } = render(
        <App initialState={state} config={config} />
      )

      const gen = getByText(/generation/i)
      const play = getByText(/play/i)
      const selectSpeed = getByLabelText(/select-speed/i)

      user.click(play)

      act(() => void jest.advanceTimersByTime(config.speed))
      act(() => void jest.advanceTimersByTime(config.speed))

      fireEvent.change(selectSpeed, { target: { value: OPTION.FAST } })

      act(() => void jest.advanceTimersByTime(config.speed / 2))
      expect(gen).toHaveTextContent(/generation(.*)4/i)

      jest.clearAllTimers()
      jest.useRealTimers()
    })

    it('reset when seed', () => {
      const { getByText } = render(<App />)

      const gen = getByText(/generation/i)
      const next = getByText(/next/i)
      const seed = getByText(/seed/i)

      expect(gen).toHaveTextContent(/generation(.*)1/i)

      user.click(next)
      user.click(next)
      user.click(next)

      user.click(seed)
      expect(gen).toHaveTextContent(/generation(.*)1/i)
    })
  })

  it('pattern selection', () => {
    const state = processor.parse('', { rows: 7, cols: 7 })

    const { getByLabelText, getByTestId } = render(<App initialState={state} />)
    const select = getByLabelText(/select-pattern/i)
    const grid = getByTestId('grid-root')

    user.selectOptions(select, PATTERNS.EMPTY.value)
    expect(grid.children).toHaveLength(0)

    user.selectOptions(select, PATTERNS.BLOCK.value)
    expect(grid.children).toHaveLength(4)
    expect([...grid.children].map(elm => elm.getAttribute('style')))
      .toMatchInlineSnapshot(`
        Array [
          "grid-row: 3; grid-column: 3;",
          "grid-row: 3; grid-column: 4;",
          "grid-row: 4; grid-column: 3;",
          "grid-row: 4; grid-column: 4;",
        ]
      `)
  })
})
