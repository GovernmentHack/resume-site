import React, { useContext, useState } from "react";
import { DragSourceMonitor, useDrag } from "react-dnd";
import styled from "styled-components";
import { FileContext } from "../App";
import { File, FileDragItem } from "../utils/types";
import { disableDragging } from "../utils/constants";

const IconContainer = styled.div`
  height: 48px;
  position: absolute;
  width: 70px;
  z-index: 0;
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
  letter-spacing: -0.025em;
  line-height: 12px;
  text-align: center;
  text-rendering: optimizeLegibility;
  text-overflow: ellipsis;
  white-space: wrap;
  overflow: hidden;
`;

const IconTextEditable = styled.input`
  width: 70px;
  height: 14px;
  background-color: rgba(1, 1, 122, 0.5);
  outline: none;
  border: none;
  color: white;
  display: block;
  font-family: px_sans_nouveaux;
  font-size: 8px;
  letter-spacing: -0.025em;
  line-height: 12px;
  text-align: center;
  text-rendering: optimizeLegibility;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='white' stroke-width='3' stroke-dasharray='1%2c 2' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
`;

function getIconClickHandler({
  files,
  setFiles,
  fileId,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  fileId: string;
}): React.MouseEventHandler<HTMLDivElement> {
  return (event) => {
    event.stopPropagation();
    const fileToChange = files.find((file) => file.fileId === fileId);
    const otherFiles = files.filter((file) => file.fileId !== fileId);
    if (fileToChange) {
      setFiles([
        ...otherFiles,
        {
          ...fileToChange,
          isHighlighted: !fileToChange.isHighlighted,
        },
      ]);
    }
  };
}

function getIconDoubleClickHandler({
  files,
  setFiles,
  setLoading,
  fileId,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fileId: string;
}): React.MouseEventHandler<HTMLDivElement> {
  return (event) => {
    event.stopPropagation();
    const fileToChange = files.find((file) => file.fileId === fileId);
    const otherFiles = files.filter((file) => file.fileId !== fileId);
    if (fileToChange) {
      // "run" a shortcut instead of opening it
      if (fileToChange.type === "shortcut") {
        fileToChange.content({ files, setFiles, setLoading });
      } else {
        const otherFilesWindowClosed = otherFiles.map((file) => {
          if (
            (file.type === "folder" || file.type === "textFile") &&
            file.windowIsFocused
          ) {
            return {
              ...file,
              windowIsFocused: false,
            };
          }
          return file;
        });
        setFiles([
          ...otherFilesWindowClosed,
          {
            ...fileToChange,
            isOpen: true,
            windowIsFocused: true,
          },
        ]);
      }
    }
  };
}

function getIconTextClickHandler({
  files,
  setFiles,
  fileId,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  fileId: string;
}): React.MouseEventHandler<HTMLDivElement> {
  return (event) => {
    const fileToChange = files.find((file) => file.fileId === fileId);
    const otherFiles = files.filter((file) => file.fileId !== fileId);
    if (!fileToChange?.textIsEditing && fileToChange?.isHighlighted) {
      event.stopPropagation();
      setFiles([
        ...otherFiles.map((file) => ({
          ...file,
          textIsEditing: false,
        })),
        {
          ...fileToChange,
          textIsEditing: !fileToChange.textIsEditing,
        },
      ]);
    }
  };
}

function getIconTextSaveHandler({
  files,
  setFiles,
  fileId,
  newFileName,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  fileId: string;
  newFileName: string;
}): React.KeyboardEventHandler<HTMLInputElement> {
  return (event) => {
    if (event.key === "Enter") {
      const fileToChange = files.find((file) => file.fileId === fileId);
      const otherFiles = files.filter((file) => file.fileId !== fileId);
      if (fileToChange && fileToChange.textIsEditing) {
        setFiles([
          ...otherFiles,
          {
            ...fileToChange,
            textIsEditing: false,
            isHighlighted: false,
            fileName: newFileName,
          },
        ]);
      }
    }
  };
}

function getFilenameText(text: string): string {
  if (text.length > 36) {
    return `${text.substring(0, 33)}...`;
  }
  return text;
}

type DesktopIconProps = File;

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
