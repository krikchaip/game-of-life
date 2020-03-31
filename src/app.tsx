import React from 'react'
import styled from 'styled-components'

function App() {
  return <Scene>Game of Life!</Scene>
}

const Scene = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  user-select: none;
`

export default App
