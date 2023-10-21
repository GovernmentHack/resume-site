import React from 'react';
import styled from 'styled-components';
import StartBar from './StartBar';
import Desktop from './Desktop';
import DesktopIcon from './DesktopIcon';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

const DesktopBackground = styled.div`
  background-color: teal;
  height: 100vh;
  width: 100vw;
  margin: -8px;
`

function App() {
  return (
    <DndProvider backend={HTML5Backend} key={1}>
      <DesktopBackground>
        <Desktop>
          <DesktopIcon icon="directory_closed_cool-0.png"/>
          <DesktopIcon icon="directory_closed_cool-0.png"/>
          <DesktopIcon icon="directory_closed_cool-0.png"/>
          <DesktopIcon icon="directory_closed_cool-0.png"/>
        </Desktop>
        <StartBar/>
      </DesktopBackground>
    </DndProvider>
  );
}

export default App;
