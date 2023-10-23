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

/**
 * border-style: dashed;
  border-size: 0.5px;
  border-color: white;
  border-radius: 0;
 */

const IconTextEditable = styled.input`
  width: 70px;
  height: 14px;
  background-color: rgba(1, 1, 122,.5);
  outline: none;
  border: none;
  color: white;
  display: block;
  font-family: px_sans_nouveaux;
  font-size: 8px;
  letter-spacing: -.025em;
  line-height: 12px;
  text-align: center;
  text-rendering: optimizeLegibility;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='white' stroke-width='3' stroke-dasharray='1%2c 2' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
`;

type DesktopIconProps = File & {
  onClickHandler: React.MouseEventHandler<HTMLDivElement>;
  onTextClickHandler: React.MouseEventHandler<HTMLDivElement>;
  onTextSave: (arg0: string) => void;
};

const DesktopIcon: React.FunctionComponent<DesktopIconProps> = (
  {
    icon,
    location,
    fileName,
    fileId,
    type,
    isHighlighted,
    textIsEditing,
    onClickHandler,
    onTextClickHandler,
    onTextSave,
  }
) => {
  const [tempFileName, setTempFileName] = useState(fileName);
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
    <IconContainer ref={dragPreview} style={{ opacity: isDragging ? 0 : 1, left: location.x, top: location.y}} onClick={onClickHandler}>
      <IconImage
        ref={drag}
        style={{
          backgroundImage: `url(icons/${icon})`,
          boxShadow: isHighlighted ? "inset 0 0 0 1000px rgba(1, 1, 122,.5)" : undefined,
        }}
      />
      {textIsEditing ?
        <IconTextEditable
          value={tempFileName}
          onChange={(event) => {
            setTempFileName(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              onTextSave(tempFileName);
            }
          }}
          autoFocus
        /> :
        <IconText
          style={{
            boxShadow: isHighlighted ? "inset 0 0 0 1000px rgba(1, 1, 122,.5)" : undefined,
          }}
          onClick={onTextClickHandler}
        >
          {fileName}
        </IconText>
      }
    </IconContainer>
  );
}

export default DesktopIcon;