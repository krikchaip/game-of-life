import { shouldAlive } from '../processor'

describe('shouldAlive', () => {
  it('live cell,  <2 neighbors -> die', () => {
    expect(shouldAlive(true, 0)).toBe(false)
    expect(shouldAlive(true, 1)).toBe(false)
  })

  it('live cell, 2-3 neighbors -> live', () => {
    expect(shouldAlive(true, 2)).toBe(true)
    expect(shouldAlive(true, 3)).toBe(true)
  })

  it('live cell,  >3 neighbors -> die', () => {
    expect(shouldAlive(true, 4)).toBe(false)
    expect(shouldAlive(true, 5)).toBe(false)
  })

  it('dead cell,   3 neighbors -> live', () => {
    expect(shouldAlive(false, 3)).toBe(true)
    expect(shouldAlive(false, 2)).toBe(false)
    expect(shouldAlive(false, 4)).toBe(false)
  })

  describe('validation', () => {
    it('throws negative neighbors', () => {
      expect(() => shouldAlive(false, -1)).toThrow(expect.any(Error))
      expect(() => shouldAlive(true, -1)).toThrow(expect.any(Error))
    })
  })
})
