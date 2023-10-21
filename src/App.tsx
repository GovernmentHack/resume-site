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

function generateIcons(count: number) {
  const iconArray = [];
  for (let key = 0; key<count; key++) {
    iconArray.push(<DesktopIcon icon="directory_closed_cool-0.png" initialLocation={{x: 8, y: (key*56)+8}} key={key}/>);
  }
  return iconArray;
}

function App() {
  return (
    <DndProvider backend={HTML5Backend} key={1}>
      <DesktopBackground>
        <Desktop>
          {generateIcons(4)}
        </Desktop>
        <StartBar/>
      </DesktopBackground>
    </DndProvider>
  );
}

export default App;
