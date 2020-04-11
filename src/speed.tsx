import React, { InputHTMLAttributes } from 'react'
import styled from 'styled-components'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> & {
  value?: Values<typeof OPTION>
}

export const OPTION = {
  SLOW: 0,
  MEDIUM: 1,
  FAST: 2
} as const

function Speed(props: Props) {
  const { value, ...otherProps } = props
  return (
    <Container>
      <Input
        {...otherProps}
        type="range"
        min={OPTION.SLOW}
        max={OPTION.FAST}
        step={1}
        value={value}
      />
      <Mark style={{ top: '-85%' }}>slow</Mark>
      <Mark style={{ top: '-85%', left: '50%', transform: 'translateX(-50%)' }}>
        medium
      </Mark>
      <Mark style={{ top: '-85%', right: '0' }}>fast</Mark>
    </Container>
  )
}

const Container = styled.span`
  position: relative;
  display: inline-flex;
`

const Input = styled.input``

const Mark = styled.div`
  position: absolute;
  font-family: monospace;
  font-size: 10px;
  letter-spacing: -1px;
`

export default Speed
