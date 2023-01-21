import { CSSProperties } from 'react'

type Props = {
  rows: number
  cols: number
  marks: number[][]
}

function Grid(props: Props) {
  const { rows, cols, marks } = props
  return (
    <div
      data-testid="grid-root"
      className="grid gap-[0.0625rem] grid-rows-[repeat(var(--rows),1vw)] grid-cols-[repeat(var(--cols),1vw)] border-[thin] border-solid border-black"
      style={{ '--rows': rows, '--cols': cols } as CSSProperties}
    >
      {marks.map(([row, col]) => (
        <div
          className="text-center bg-[lightgreen] shadow-[0_0_0_0.0625rem_black]"
          style={{ gridRow: row + 1, gridColumn: col + 1 }}
          key={`${row}-${col}`}
        />
      ))}
    </div>
  )
}

export default Grid
