import React from 'react'
import user from '@testing-library/user-event'
import { render, act } from '@testing-library/react'
import { axe } from 'jest-axe'

import { noop } from '@lib/utils'
import * as processor from '../processor'
import App from '../app'

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

  it('select speed', () => {
    const { getByLabelText } = render(<App initialState={state} />)
    getByLabelText(/speed/i)
  })
})
