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
  return <Root data-testid="grid-root" rows={rows} cols={cols}></Root>
}

type RootProps = { rows: number; cols: number }
const Root = styled.div<RootProps>`
  display: grid;
  grid-template-rows: repeat(${props('rows')}, 2vw);
  grid-template-columns: repeat(${props('cols')}, 2vw);

  border: thin solid black;
`

export default Grid
