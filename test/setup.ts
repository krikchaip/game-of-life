import '@testing-library/jest-dom'

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare global {
  // ref: https://github.com/testing-library/jest-dom/issues/427
  namespace jest {
    interface Matchers<R = void>
      extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
  }
}
