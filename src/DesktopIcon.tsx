import React, { useState } from 'react';
import { DragSourceMonitor, XYCoord, useDrag } from 'react-dnd'
import styled from 'styled-components';
import { DragTypes, FileIcon } from './utils/constants';

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
  icon?: typeof FileIcon[keyof typeof FileIcon];
  initialLocation?: XYCoord;
  fileName?: string;
  fileId: string;
  type: typeof DragTypes[keyof typeof DragTypes];
};

const DesktopIcon: React.FunctionComponent<DesktopIconProps> = (
  {
    icon = FileIcon.closedFolder,
    initialLocation = { x: 8, y: 8 },
    fileName = "New Folder",
    fileId,
    type,
  }
) => {
  const [location, setLocation] = useState(initialLocation);
  const [{ isDragging, endLocation }, drag, dragPreview] = useDrag(() => ({
    type,
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
    <IconContainer ref={dragPreview} style={{ opacity: isDragging ? 0 : 1, left: location.x, top: location.y}} key={fileId}>
      <IconImage ref={drag} style={{ backgroundImage: `url(icons/${icon})`}} />
      <IconText>{fileName}</IconText>
    </IconContainer>
  );
}

export default DesktopIcon;