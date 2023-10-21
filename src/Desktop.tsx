import React, { ReactNode } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd'
import { DragTypes } from './utils/constants';
import styled from 'styled-components';
// import styled from 'styled-components';

const DesktopDiv = styled.div`
height: 100%;
`

const Desktop: React.FunctionComponent<{ children: ReactNode }> = ({children}) => {
  const [{ canDrop, isOver, dropLocation }, drop] = useDrop(() => ({
    accept: DragTypes.DesktopIcon,
    collect: (monitor: DropTargetMonitor<unknown, unknown>) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      dropLocation: monitor.getClientOffset(),
    }),
    hover: (item, monitor) => {
      // console.log(monitor.canDrop());
    },
    drop: (item, monitor) => {
      const endLocation = monitor.getSourceClientOffset();
      return endLocation;
    },
  }));

  return (
    <DesktopDiv ref={drop}>
      {children}
    </DesktopDiv>
  );
}

export default Desktop;