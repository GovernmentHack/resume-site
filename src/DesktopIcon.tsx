import React, { useState } from 'react';
import { DragSourceMonitor, XYCoord, useDrag } from 'react-dnd'
import styled from 'styled-components';
import { DragTypes } from './utils/constants';

const IconImage = styled.div`
  background-repeat: no-repeat;
  height: 100%;
`

const DesktopIcon: React.FunctionComponent<{ icon: string }> = ({icon}) => {
  const [location, setLocation] = useState({ x: 1, y: 1 });
  const [{ isDragging, endLocation }, drag, dragPreview] = useDrag(() => ({
    type: DragTypes.DesktopIcon,
    collect: (monitor: DragSourceMonitor<unknown, unknown>) => {
      return {
        isDragging: monitor.isDragging(),
        endLocation: monitor.getClientOffset(),
      }
    },
    end: (draggedItem, monitor) => {
      const tempLocation = monitor.getDropResult() as XYCoord | null;
      console.log("did drop!!");
      console.log(tempLocation);
      if (tempLocation) {
        setLocation(tempLocation);
        console.log("set new location!");
      }
    },
    options: {
      dropEffect: "move"
    }
  }));

  return (
    <div ref={dragPreview} style={{ opacity: isDragging ? 0 : 1, left: location.x, top: location.y, position: "relative", width: "48px", height: "48px", zIndex: 99999}}>
      <IconImage ref={drag} style={{ backgroundImage: `url(icons/${icon})`}} />
    </div>
  );
}

export default DesktopIcon;