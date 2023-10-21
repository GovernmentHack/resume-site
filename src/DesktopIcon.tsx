import React, { useState } from 'react';
import { DragSourceMonitor, XYCoord, useDrag } from 'react-dnd'
import styled from 'styled-components';
import { DragTypes } from './utils/constants';

const DRAG_OFFSET_FIX = 17;

const IconContainer = styled.div`
  height: 48px;
  position: absolute;
  width: 70px;
  z-index: 99999;
`;

const IconImage = styled.div`
  background-repeat: no-repeat;
  height: 32px;
  margin-bottom: 4px;
  margin-left: auto;
  margin-right: auto;
  width: 32px;
`;

const IconText = styled.span`
  color: white;
  display: block;
  font-family: px_sans_nouveaux;
  font-size: 8px;
  letter-spacing: -.025em;
  line-height: 12px;
  text-align: center;
  text-rendering: optimizeLegibility;
`;

type DesktopIconProps = {
  icon?: string;
  initialLocation?: XYCoord;
  fileName?: string;

};

const DesktopIcon: React.FunctionComponent<DesktopIconProps> = (
  {
    icon = "directory_closed_cool-0.png",
    initialLocation = { x: 8, y: 8 },
    fileName = "New Folder",
  }
) => {
  const [location, setLocation] = useState(initialLocation);
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
      if (tempLocation) {
        setLocation({...tempLocation, x: tempLocation.x-DRAG_OFFSET_FIX });
      }
    },
    options: {
      dropEffect: "move"
    }
  }));

  return (
    <IconContainer ref={dragPreview} style={{ opacity: isDragging ? 0 : 1, left: location.x, top: location.y}}>
      <IconImage ref={drag} style={{ backgroundImage: `url(icons/${icon})`}} />
      <IconText>{fileName}</IconText>
    </IconContainer>
  );
}

export default DesktopIcon;