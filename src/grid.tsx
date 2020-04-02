import React from 'react'
import styled from 'styled-components'

import { props } from '@lib/utils'

type Props = {
  rows: number
  cols: number
  marks: number[][]
}

function Grid(props: Props) {
  const { rows, cols, marks } = props
  return (
    <Root data-testid="grid-root" rows={rows} cols={cols}>
      {marks.map(([row, col]) => (
        <Cell
          style={{ gridRow: row + 1, gridColumn: col + 1 }}
          key={`${row}-${col}`}
        />
      ))}
    </Root>
  )
}

type RootProps = { rows: number; cols: number }
const Root = styled.div<RootProps>`
  display: grid;
  grid-template-rows: repeat(${props('rows')}, 2vw);
  grid-template-columns: repeat(${props('cols')}, 2vw);
  grid-gap: 1px;

  border: thin solid black;
`

const Cell = styled.div`
  text-align: center;
  background-color: lightgreen;
  box-shadow: 0 0 0 1px black;
`

export default Grid
