import React, { useContext, useState } from "react";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { FileContext } from "../../App";
import { DesktopFile, FileDragItem } from "../../utils/types";
import { disableDragging } from "../../utils/constants";
import { getIconClickHandler } from "./getIconClickHandler";
import { getIconDoubleClickHandler } from "./getIconDoubleClickHandler";
import { getIconTextClickHandler } from "./getIconTextClickHandler";
import { getIconTextSaveHandler } from "./getIconTextSaveHandler";
import {
  IconContainer,
  IconImage,
  IconTextEditable,
  IconText,
} from "./ComponentStyles";

function getFilenameText(text: string): string {
  if (text.length > 36) {
    return `${text.substring(0, 33)}...`;
  }
  return text;
}

type DesktopIconProps = DesktopFile;

const DesktopIcon: React.FunctionComponent<DesktopIconProps> = ({
  icon,
  location,
  fileName,
  fileId,
  type,
  isHighlighted,
  textIsEditing,
  directory,
}) => {
  const { files, setFiles, setLoading } = useContext(FileContext);
  const [tempFileName, setTempFileName] = useState(fileName);
  const [{ isDragging }, drag] = useDrag<
    FileDragItem,
    unknown,
    { isDragging: boolean }
  >(() => ({
    type,
    collect: (monitor: DragSourceMonitor<unknown, unknown>) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
    end: (draggedItem, monitor) => {
      // stub
    },
    options: {
      dropEffect: "move",
    },
    item: {
      fileId,
      type,
    },
  }));

  return (
    <IconContainer
      ref={drag}
      style={{ opacity: isDragging ? 0 : 1, left: location.x, top: location.y }}
      onClick={getIconClickHandler({ fileId, files, setFiles })}
      onDoubleClick={getIconDoubleClickHandler({
        fileId,
        files,
        setFiles,
        setLoading,
      })}
    >
      <IconImage
        style={{
          backgroundImage: `url(icons/${icon})`,
          boxShadow: isHighlighted
            ? "inset 0 0 0 1000px rgba(1, 1, 122,.5)"
            : undefined,
        }}
      />
      {textIsEditing ? (
        <IconTextEditable
          value={tempFileName}
          onChange={(event) => {
            setTempFileName(event.target.value);
          }}
          onKeyUp={getIconTextSaveHandler({
            fileId,
            files,
            setFiles,
            newFileName: tempFileName,
          })}
          autoFocus
        />
      ) : (
        <IconText
          style={{
            boxShadow: isHighlighted
              ? "inset 0 0 0 1000px rgba(1, 1, 122,.5)"
              : undefined,
            color: directory ? "black" : undefined,
          }}
          onClick={getIconTextClickHandler({ fileId, files, setFiles })}
          {...disableDragging}
        >
          {getFilenameText(fileName)}
        </IconText>
      )}
    </IconContainer>
  );
};

export default DesktopIcon;
