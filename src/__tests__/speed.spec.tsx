import { render, fireEvent } from '@testing-library/react'

import Speed, { OPTION, STEP } from '../speed'

it('show speed marks', () => {
  const { queryByText } = render(<Speed />)

  expect(queryByText(/slow/i)).toBeInTheDocument()
  expect(queryByText(/medium/i)).toBeInTheDocument()
  expect(queryByText(/fast/i)).toBeInTheDocument()
})

it('allow only 3 options slow, medium ,fast (default medium)', () => {
  const { container } = render(<Speed />)
  const range = container.querySelector('input')!

  expect(+range.step).toBe(STEP)
  expect(+range.min).toBe(OPTION.SLOW)
  expect(+range.max).toBe(OPTION.FAST)
  expect(+range.value).toBe(OPTION.MEDIUM)
})

it('call onChange with speed option', () => {
  const onChange = vi.fn()
  const { container } = render(<Speed value={'MEDIUM'} onChange={onChange} />)

  const range = container.querySelector('input')!

  fireEvent.change(range, { target: { value: OPTION.FAST } })
  expect(onChange).toHaveBeenNthCalledWith(1, 'FAST')

  fireEvent.change(range, { target: { value: OPTION.SLOW } })
  expect(onChange).toHaveBeenNthCalledWith(2, 'SLOW')
})
