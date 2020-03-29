import * as processor from '../processor'

describe('game rule (classic)', () => {
  it('live cell,  <2 neighbors -> die', () => {
    expect(processor.classicRule(true, 0)).toBe(false)
    expect(processor.classicRule(true, 1)).toBe(false)
  })

  it('live cell, 2-3 neighbors -> live', () => {
    expect(processor.classicRule(true, 2)).toBe(true)
    expect(processor.classicRule(true, 3)).toBe(true)
  })

  it('live cell,  >3 neighbors -> die', () => {
    expect(processor.classicRule(true, 4)).toBe(false)
    expect(processor.classicRule(true, 5)).toBe(false)
  })

  it('dead cell,   3 neighbors -> live', () => {
    expect(processor.classicRule(false, 3)).toBe(true)
    expect(processor.classicRule(false, 2)).toBe(false)
    expect(processor.classicRule(false, 4)).toBe(false)
  })

  describe('validation', () => {
    it('throws negative neighbors', () => {
      expect(() => processor.classicRule(false, -1)).toThrow(expect.any(Error))
      expect(() => processor.classicRule(true, -1)).toThrow(expect.any(Error))
    })
  })
})

describe('stringify', () => {
  it('convert game state into readable string', () => {
    const gameState: processor.GameState = {
      grid: { rows: 4, cols: 4 },
      population: {
        '1': {
          '1': true,
          '2': true,
        },
        '2': {
          '1': true,
          '2': true,
        },
      },
    }

    expect(processor.stringify(gameState)).toMatchInlineSnapshot(`
      "
      x x x x
      x o o x
      x o o x
      x x x x
      "
    `)

    gameState.population = {
      '0': {
        '1': true,
        '2': true,
      },
      '1': {
        '0': true,
        '3': true,
      },
      '2': {
        '1': true,
        '2': true,
      },
    }

    expect(processor.stringify(gameState)).toMatchInlineSnapshot(`
      "
      x o o x
      o x x o
      x o o x
      x x x x
      "
    `)
  })
})

describe('parse', () => {
  it('rehydrate game state from text', () => {
    let text = `
      x x x x
      x o o x
      x o o x
      x x x x
    `

    expect(processor.parse(text)).toEqual<processor.GameState>({
      grid: { rows: 4, cols: 4 },
      population: {
        '1': {
          '1': true,
          '2': true,
        },
        '2': {
          '1': true,
          '2': true,
        },
      },
    })

    text = `
      x o o x
      o x x o
      x o o x
    `

    expect(processor.parse(text)).toEqual<processor.GameState>({
      grid: { rows: 3, cols: 4 },
      population: {
        '0': {
          '1': true,
          '2': true,
        },
        '1': {
          '0': true,
          '3': true,
        },
        '2': {
          '1': true,
          '2': true,
        },
      },
    })
  })

  describe('validation', () => {
    it('wrong character', () => {
      expect(() =>
        processor.parse(`
        - o o -
        o - - o
        - o o -
      `)
      ).toThrow(expect.any(Error))
    })
  })
})

describe('next generation (classic)', () => {
  describe('still lifes', () => {
    it('block', () => {
      const currentState = processor.parse(`
        x x x x
        x o o x
        x o o x
        x x x x
      `)
      const nextState = processor.nextGeneration(
        currentState,
        processor.classicRule
      )

      expect(processor.stringify(nextState)).toMatchInlineSnapshot(`
        "
        x x x x
        x o o x
        x o o x
        x x x x
        "
      `)
    })

    it('bee-hive', () => {
      const currentState = processor.parse(`
        x o o x
        o x x o
        x o o x
      `)
      const nextState = processor.nextGeneration(
        currentState,
        processor.classicRule
      )

      expect(processor.stringify(nextState)).toMatchInlineSnapshot(`
        "
        x o o x
        o x x o
        x o o x
        "
      `)
    })

    it('loaf', () => {
      const currentState = processor.parse(`
        x o o x
        o x x o
        x o x o
        x x o x
      `)
      const nextState = processor.nextGeneration(
        currentState,
        processor.classicRule
      )

      expect(processor.stringify(nextState)).toMatchInlineSnapshot(`
        "
        x o o x
        o x x o
        x o x o
        x x o x
        "
      `)
    })

    it('boat', () => {
      const currentState = processor.parse(`
        o o x
        o x o
        x o x
      `)
      const nextState = processor.nextGeneration(
        currentState,
        processor.classicRule
      )

      expect(processor.stringify(nextState)).toMatchInlineSnapshot(`
        "
        o o x
        o x o
        x o x
        "
      `)
    })

    it('tub', () => {
      const currentState = processor.parse(`
        x o x
        o x o
        x o x
      `)
      const nextState = processor.nextGeneration(
        currentState,
        processor.classicRule
      )

      expect(processor.stringify(nextState)).toMatchInlineSnapshot(`
        "
        x o x
        o x o
        x o x
        "
      `)
    })
  })

  describe('oscillators', () => {
    it('blinker', () => {
      const currentState = processor.parse(`
        x x x
        o o o
        x x x
      `)

      let nextState = processor.nextGeneration(
        currentState,
        processor.classicRule
      )
      expect(processor.stringify(nextState)).toMatchInlineSnapshot(`
        "
        x o x
        x o x
        x o x
        "
      `)

      nextState = processor.nextGeneration(nextState, processor.classicRule)
      expect(processor.stringify(nextState)).toMatchInlineSnapshot(`
        "
        x x x
        o o o
        x x x
        "
      `)
    })

    it('toad', () => {
      const currentState = processor.parse(`
        x x x x
        x o o o
        o o o x
        x x x x
      `)

      let nextState = processor.nextGeneration(
        currentState,
        processor.classicRule
      )
      expect(processor.stringify(nextState)).toMatchInlineSnapshot(`
        "
        x x o x
        o x x o
        o x x o
        x o x x
        "
      `)

      nextState = processor.nextGeneration(nextState, processor.classicRule)
      expect(processor.stringify(nextState)).toMatchInlineSnapshot(`
        "
        x x x x
        x o o o
        o o o x
        x x x x
        "
      `)
    })
  })

  describe('spaceships', () => {
    it('glider', () => {
      const currentState = processor.parse(`
        x o x x
        x x o x
        o o o x
        x x x x
      `)

      let nextState = processor.nextGeneration(
        currentState,
        processor.classicRule
      )
      expect(processor.stringify(nextState)).toMatchInlineSnapshot(`
        "
        x x x x
        o x o x
        x o o x
        x o x x
        "
      `)

      nextState = processor.nextGeneration(nextState, processor.classicRule)
      expect(processor.stringify(nextState)).toMatchInlineSnapshot(`
        "
        x x x x
        x x o x
        o x o x
        x o o x
        "
      `)

      nextState = processor.nextGeneration(nextState, processor.classicRule)
      expect(processor.stringify(nextState)).toMatchInlineSnapshot(`
        "
        x x x x
        x o x x
        x x o o
        x o o x
        "
      `)

      nextState = processor.nextGeneration(nextState, processor.classicRule)
      expect(processor.stringify(nextState)).toMatchInlineSnapshot(`
        "
        x x x x
        x x o x
        x x x o
        x o o o
        "
      `)
    })

    it('glider (off-grid)', () => {
      const currentState = processor.parse(`
        x o x
        x x o
        o o o
      `)

      const nextState = processor.nextGeneration(
        currentState,
        processor.classicRule
      )
      expect(processor.stringify(nextState)).toMatchInlineSnapshot(`
        "
        x x x
        o x o
        x o o
        "
      `)
    })
  })
})
