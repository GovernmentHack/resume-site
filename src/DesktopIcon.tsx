import React, { useState } from 'react';
import { DragSourceMonitor, XYCoord, useDrag } from 'react-dnd'
import styled from 'styled-components';
import { DragTypes, FileIcon } from './utils/constants';
import { File } from './App';

export type FileDragItem = Pick<File, "fileId">;

const IconContainer = styled.div`
  height: 48px;
  position: absolute;
  width: 70px;
  z-index: 100;
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

type DesktopIconProps = File & {
  onClickHandler: React.MouseEventHandler<HTMLDivElement>;
};

const DesktopIcon: React.FunctionComponent<DesktopIconProps> = (
  {
    icon = FileIcon.closedFolder,
    location,
    fileName = "New Folder",
    fileId,
    type,
    isHighlighted,
    onClickHandler,
  }
) => {
  const [{ isDragging }, drag, dragPreview] = useDrag<FileDragItem, unknown, {isDragging: boolean}>(() => ({
    type,
    collect: (monitor: DragSourceMonitor<unknown, unknown>) => {
      return {
        isDragging: monitor.isDragging(),
      }
    },
    end: (draggedItem, monitor) => {
      // stub
    },
    options: {
      dropEffect: "move"
    },
    item: {
      fileId,
    }
  }));

  return (
    <IconContainer ref={dragPreview} style={{ opacity: isDragging ? 0 : 1, left: location.x, top: location.y}} key={fileId} onClick={onClickHandler}>
      <IconImage
        ref={drag}
        style={{
          backgroundImage: `url(icons/${icon})`,
          boxShadow: isHighlighted ? "inset 0 0 0 1000px rgba(1, 1, 122,.5)" : undefined,
        }}
      />
      <IconText
        style={{
          boxShadow: isHighlighted ? "inset 0 0 0 1000px rgba(1, 1, 122,.5)" : undefined,
        }}
      >{fileName}</IconText>
    </IconContainer>
  );
}

export default DesktopIcon;