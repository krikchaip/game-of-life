import * as processor from '../processor'

describe('shouldAlive (classic)', () => {
  it('live cell,  <2 neighbors -> die', () => {
    expect(processor.shouldAlive(true, 0)).toBe(false)
    expect(processor.shouldAlive(true, 1)).toBe(false)
  })

  it('live cell, 2-3 neighbors -> live', () => {
    expect(processor.shouldAlive(true, 2)).toBe(true)
    expect(processor.shouldAlive(true, 3)).toBe(true)
  })

  it('live cell,  >3 neighbors -> die', () => {
    expect(processor.shouldAlive(true, 4)).toBe(false)
    expect(processor.shouldAlive(true, 5)).toBe(false)
  })

  it('dead cell,   3 neighbors -> live', () => {
    expect(processor.shouldAlive(false, 3)).toBe(true)
    expect(processor.shouldAlive(false, 2)).toBe(false)
    expect(processor.shouldAlive(false, 4)).toBe(false)
  })

  describe('validation', () => {
    it('throws negative neighbors', () => {
      expect(() => processor.shouldAlive(false, -1)).toThrow(expect.any(Error))
      expect(() => processor.shouldAlive(true, -1)).toThrow(expect.any(Error))
    })
  })
})

describe('readState', () => {
  it('convert nested array to readable string', () => {
    let narray = [
      [false, false, false, false],
      [false, true, true, false],
      [false, true, true, false],
      [false, false, false, false],
    ]

    expect(processor.readState(narray)).toMatchInlineSnapshot(`
      "
      x x x x
      x o o x
      x o o x
      x x x x
      "
    `)

    narray = [
      [false, true, true, false],
      [true, false, false, true],
      [false, true, true, false],
    ]

    expect(processor.readState(narray)).toMatchInlineSnapshot(`
      "
      x o o x
      o x x o
      x o o x
      "
    `)
  })
})

describe('parseState', () => {
  it('convert state string to nested array', () => {
    let sstring = `
      x x x x
      x o o x
      x o o x
      x x x x
    `

    expect(processor.parseState(sstring)).toEqual([
      [false, false, false, false],
      [false, true, true, false],
      [false, true, true, false],
      [false, false, false, false],
    ])

    sstring = `
      x o o x
      o x x o
      x o o x
    `

    expect(processor.parseState(sstring)).toEqual([
      [false, true, true, false],
      [true, false, false, true],
      [false, true, true, false],
    ])
  })

  describe('validation', () => {
    it('wrong character', () => {
      expect(() =>
        processor.parseState(`
        - o o -
        o - - o
        - o o -
      `)
      ).toThrow(expect.any(Error))
    })
  })
})

describe('nextState (classic)', () => {
  const spy = jest.spyOn(processor, 'shouldAlive')

  afterEach(() => {
    spy.mockClear()
  })

  describe('still lifes', () => {
    it('block', () => {
      const currentState = processor.parseState(`
        x x x x
        x o o x
        x o o x
        x x x x
      `)
      const nextState = processor.nextState(currentState, processor.shouldAlive)

      expect(processor.readState(nextState)).toMatchInlineSnapshot(`
        "
        x x x x
        x o o x
        x o o x
        x x x x
        "
      `)
      expect(processor.shouldAlive).toBeCalled()
    })

    it('bee-hive', () => {
      const currentState = processor.parseState(`
        x o o x
        o x x o
        x o o x
      `)
      const nextState = processor.nextState(currentState, processor.shouldAlive)

      expect(processor.readState(nextState)).toMatchInlineSnapshot(`
        "
        x o o x
        o x x o
        x o o x
        "
      `)
      expect(processor.shouldAlive).toBeCalled()
    })

    it('loaf', () => {
      const currentState = processor.parseState(`
        x o o x
        o x x o
        x o x o
        x x o x
      `)
      const nextState = processor.nextState(currentState, processor.shouldAlive)

      expect(processor.readState(nextState)).toMatchInlineSnapshot(`
        "
        x o o x
        o x x o
        x o x o
        x x o x
        "
      `)
      expect(processor.shouldAlive).toBeCalled()
    })

    it('boat', () => {
      const currentState = processor.parseState(`
        o o x
        o x o
        x o x
      `)
      const nextState = processor.nextState(currentState, processor.shouldAlive)

      expect(processor.readState(nextState)).toMatchInlineSnapshot(`
        "
        o o x
        o x o
        x o x
        "
      `)
      expect(processor.shouldAlive).toBeCalled()
    })

    it('tub', () => {
      const currentState = processor.parseState(`
        x o x
        o x o
        x o x
      `)
      const nextState = processor.nextState(currentState, processor.shouldAlive)

      expect(processor.readState(nextState)).toMatchInlineSnapshot(`
        "
        x o x
        o x o
        x o x
        "
      `)
      expect(processor.shouldAlive).toBeCalled()
    })
  })

  describe('oscillators', () => {
    it('blinker', () => {
      const currentState = processor.parseState(`
        x x x
        o o o
        x x x
      `)

      let nextState = processor.nextState(currentState, processor.shouldAlive)
      expect(processor.readState(nextState)).toMatchInlineSnapshot(`
        "
        x o x
        x o x
        x o x
        "
      `)
      expect(processor.shouldAlive).toBeCalled()

      nextState = processor.nextState(nextState, processor.shouldAlive)
      expect(processor.readState(nextState)).toMatchInlineSnapshot(`
        "
        x x x
        o o o
        x x x
        "
      `)
    })

    it('toad', () => {
      const currentState = processor.parseState(`
        x x x x
        x o o o
        o o o x
        x x x x
      `)

      let nextState = processor.nextState(currentState, processor.shouldAlive)
      expect(processor.readState(nextState)).toMatchInlineSnapshot(`
        "
        x x o x
        o x x o
        o x x o
        x o x x
        "
      `)
      expect(processor.shouldAlive).toBeCalled()

      nextState = processor.nextState(nextState, processor.shouldAlive)
      expect(processor.readState(nextState)).toMatchInlineSnapshot(`
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
      const currentState = processor.parseState(`
        x o x x
        x x o x
        o o o x
        x x x x
      `)

      let nextState = processor.nextState(currentState, processor.shouldAlive)
      expect(processor.readState(nextState)).toMatchInlineSnapshot(`
        "
        x x x x
        o x o x
        x o o x
        x o x x
        "
      `)
      expect(processor.shouldAlive).toBeCalled()

      nextState = processor.nextState(currentState, processor.shouldAlive)
      expect(processor.readState(nextState)).toMatchInlineSnapshot(`
        "
        x x x x
        x x o x
        o x o x
        x o o x
        "
      `)

      nextState = processor.nextState(currentState, processor.shouldAlive)
      expect(processor.readState(nextState)).toMatchInlineSnapshot(`
        "
        x x x x
        x o x x
        x x o o
        x o o x
        "
      `)

      nextState = processor.nextState(currentState, processor.shouldAlive)
      expect(processor.readState(nextState)).toMatchInlineSnapshot(`
        "
        x x x x
        x x o x
        x x x o
        x o o o
        "
      `)
    })

    it('glider (off-grid)', () => {
      const currentState = processor.parseState(`
        x o x
        x x o
        o o o
      `)

      const nextState = processor.nextState(currentState, processor.shouldAlive)
      expect(processor.readState(nextState)).toMatchInlineSnapshot(`
        "
        x x x
        o x o
        x o o
        "
      `)
      expect(processor.shouldAlive).toBeCalled()
    })
  })
})
