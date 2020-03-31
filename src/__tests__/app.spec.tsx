import React from 'react'
import { render } from '@testing-library/react'
import { noop } from '@lib/utils'

import App from '../app'

it('render successfully', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(noop)

  expect(() => render(<App />)).not.toThrow()
  expect(console.error).not.toBeCalled()

  spy.mockRestore()
})
