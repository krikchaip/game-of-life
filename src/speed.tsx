import React, { InputHTMLAttributes, ChangeEvent } from 'react'
import styled from 'styled-components'

export type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  keyof OwnProps
> &
  OwnProps
type OwnProps = {
  value?: keyof typeof OPTION
  onChange?: (value: Exclude<OwnProps['value'], undefined>) => unknown
}

export const OPTION = {
  SLOW: 0,
  MEDIUM: 1,
  FAST: 2
} as const
export const STEP = 1

function reverseOption() {
  return Object.fromEntries(Object.entries(OPTION).map(([txt, n]) => [n, txt]))
}

function Speed(props: Props) {
  const { value, onChange, ...otherProps } = props

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    onChange && (await onChange(reverseOption()[value] as any))
  }

  return (
    <Container>
      <Input
        {...otherProps}
        type="range"
        min={OPTION.SLOW}
        max={OPTION.FAST}
        step={STEP}
        value={value ? OPTION[value] : undefined}
        onChange={handleChange}
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
