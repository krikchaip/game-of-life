import { minimum, maximum } from '@lib/utils'

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
          '2': true
        },
        '2': {
          '1': true,
          '2': true
        }
      }
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
        '2': true
      },
      '1': {
        '0': true,
        '3': true
      },
      '2': {
        '1': true,
        '2': true
      }
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
          '2': true
        },
        '2': {
          '1': true,
          '2': true
        }
      }
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
          '2': true
        },
        '1': {
          '0': true,
          '3': true
        },
        '2': {
          '1': true,
          '2': true
        }
      }
    })
  })

  it('throws on wrong character', () => {
    expect(() =>
      processor.parse(`
      - o o -
      o - - o
      - o o -
    `)
    ).toThrow(expect.any(Error))
  })

  it('empty text return blank grid', () => {
    expect(() => processor.parse('')).not.toThrow()
    expect(processor.parse('')).toEqual<processor.GameState>({
      grid: { rows: 0, cols: 0 },
      population: {}
    })
  })

  describe('with options', () => {
    const beehive = {
      fit: {
        text: `
          x o o x
          o x x o
          x o o x
        `,
        population: {
          '0': {
            '1': true,
            '2': true
          },
          '1': {
            '0': true,
            '3': true
          },
          '2': {
            '1': true,
            '2': true
          }
        } as const
      },
      span: {
        text: `
          x x x x x x
          x x o o x x
          x o x x o x
          x x o o x x
          x x x x x x
        `,
        population: {
          '1': {
            '2': true,
            '3': true
          },
          '2': {
            '1': true,
            '4': true
          },
          '3': {
            '2': true,
            '3': true
          }
        } as const
      }
    }

    describe('rows', () => {
      it('>= text rows', () => {
        let rows = 3
        expect(processor.parse(beehive.fit.text, { rows })).toEqual<
          processor.GameState
        >({
          grid: { rows, cols: 4 },
          population: beehive.fit.population
        })

        rows = 5
        expect(processor.parse(beehive.fit.text, { rows })).toEqual<
          processor.GameState
        >({
          grid: { rows, cols: 4 },
          population: beehive.fit.population
        })

        rows = 5
        expect(processor.parse(beehive.span.text, { rows })).toEqual<
          processor.GameState
        >({
          grid: { rows, cols: 6 },
          population: beehive.span.population
        })

        rows = 7
        expect(processor.parse(beehive.span.text, { rows })).toEqual<
          processor.GameState
        >({
          grid: { rows, cols: 6 },
          population: beehive.span.population
        })
      })

      it('<  text rows should throw an error', () => {
        const rows = 2
        expect(() => processor.parse(beehive.fit.text, { rows })).toThrow(
          expect.any(Error)
        )
        expect(() => processor.parse(beehive.span.text, { rows })).toThrow(
          expect.any(Error)
        )
      })

      it('empty text return black grid with specified rows', () => {
        expect(processor.parse('', { rows: 3 })).toEqual<processor.GameState>({
          grid: { rows: 3, cols: 0 },
          population: {}
        })
      })
    })

    describe('cols', () => {
      it('>= text cols', () => {
        let rows = 3
        let cols = 4
        expect(processor.parse(beehive.fit.text, { cols })).toEqual<
          processor.GameState
        >({
          grid: { rows, cols },
          population: beehive.fit.population
        })

        cols = 5
        expect(processor.parse(beehive.fit.text, { cols })).toEqual<
          processor.GameState
        >({
          grid: { rows, cols },
          population: beehive.fit.population
        })

        rows = 5
        cols = 6
        expect(processor.parse(beehive.span.text, { cols })).toEqual<
          processor.GameState
        >({
          grid: { rows, cols },
          population: beehive.span.population
        })

        cols = 7
        expect(processor.parse(beehive.span.text, { cols })).toEqual<
          processor.GameState
        >({
          grid: { rows, cols },
          population: beehive.span.population
        })
      })

      it('<  text cols should throw an error', () => {
        const cols = 3
        expect(() => processor.parse(beehive.fit.text, { cols })).toThrow(
          expect.any(Error)
        )
        expect(() => processor.parse(beehive.span.text, { cols })).toThrow(
          expect.any(Error)
        )
      })

      it('empty text return black grid with specified cols', () => {
        expect(processor.parse('', { cols: 3 })).toEqual<processor.GameState>({
          grid: { rows: 0, cols: 3 },
          population: {}
        })
      })
    })

    describe('center', () => {
      const option = { rows: 7, cols: 7 }

      it('return center-shifted population', () => {
        const result = processor.parse(beehive.fit.text, {
          ...option,
          center: true
        })

        expect(result).toEqual<processor.GameState>({
          grid: option,
          population: {
            '2': {
              '2': true,
              '3': true
            },
            '3': {
              '1': true,
              '4': true
            },
            '4': {
              '2': true,
              '3': true
            }
          }
        })
      })

      it('without option.rows and options.cols ... just return as is', () => {
        let result = processor.parse(beehive.fit.text, { center: true })
        expect(result).toEqual<processor.GameState>({
          grid: { rows: 3, cols: 4 },
          population: beehive.fit.population
        })

        result = processor.parse(beehive.span.text, { center: true })
        expect(result).toEqual<processor.GameState>({
          grid: { rows: 5, cols: 6 },
          population: beehive.span.population
        })
      })
    })
  })
})

describe('entries', () => {
  it('convert coordinates into array of positions', () => {
    const coordinates: processor.Coordinates = {
      '1': {
        '1': true,
        '2': true
      },
      '2': {
        '1': true,
        '2': true
      }
    }

    expect(processor.entries(coordinates)).toEqual([
      [1, 1],
      [1, 2],
      [2, 1],
      [2, 2]
    ])
  })
})

describe('seed', () => {
  const grid = { rows: 2, cols: 3 }

  let random: jest.SpyInstance<number, []>

  beforeEach(() => {
    random = jest.spyOn(Math, 'random').mockReturnValue(1)
  })

  it('population coordinates must be a number', () => {
    const result = processor.seed(grid.rows, grid.cols)

    const rowIndices = Object.keys(result.population)
    const colIndices = rowIndices.flatMap(r =>
      Object.keys(result.population[r])
    )

    expect(rowIndices).toContainEqual(expect.stringMatching(/\d+/))
    expect(colIndices).toContainEqual(expect.stringMatching(/\d+/))
  })

  it('all generated coordinates lies within the grid', () => {
    const result = processor.seed(grid.rows, grid.cols)

    const rowIndices = Object.keys(result.population)
    const colIndices = rowIndices.flatMap(r =>
      Object.keys(result.population[r])
    )

    const [minRow, maxRow] = [minimum, maximum].map(f =>
      f(rowIndices.map(r => +r))
    )
    const [minCol, maxCol] = [minimum, maximum].map(f =>
      f(colIndices.map(c => +c))
    )

    expect(minRow).toBeGreaterThanOrEqual(0)
    expect(minCol).toBeGreaterThanOrEqual(0)

    expect(maxRow).toBeLessThan(grid.rows)
    expect(maxCol).toBeLessThan(grid.cols)
  })

  it('generated population must not exceed given spaces', () => {
    let result = processor.seed(grid.rows, grid.cols)
    const total = (rs: typeof result) =>
      Object.keys(rs.population).reduce((p, row) => {
        return p + Object.keys(rs.population[row]).length
      }, 0)

    expect(result.grid).toEqual(grid)
    expect(total(result)).toBeLessThanOrEqual(grid.rows * grid.cols)

    random.mockReturnValue(1)
    result = processor.seed(grid.rows, grid.cols)
    expect(total(result)).toBe(grid.rows * grid.cols)

    random.mockReturnValue(0)
    result = processor.seed(grid.rows, grid.cols)
    expect(total(result)).toBe(0)
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
