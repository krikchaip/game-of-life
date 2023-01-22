import { InputHTMLAttributes, ChangeEvent } from 'react'

export type Props = OwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof OwnProps>

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
    <div className="relative inline-flex">
      <input
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
    </div>
  )
}

const Mark = (props: JSX.IntrinsicElements['div']) => (
  <div className="absolute font-mono text-[10px] tracking-[-1px]" {...props} />
)

export default Speed
