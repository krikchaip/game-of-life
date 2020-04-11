import React from 'react'
import { render } from '@testing-library/react'

import Speed from '../speed'

it('show speed marks', () => {
  const { queryByText } = render(<Speed />)

  expect(queryByText(/slow/i)).toBeInTheDocument()
  expect(queryByText(/medium/i)).toBeInTheDocument()
  expect(queryByText(/fast/i)).toBeInTheDocument()
})
