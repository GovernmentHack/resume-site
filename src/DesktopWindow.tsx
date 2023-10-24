import React, { useContext } from "react";
import { FileContext } from "./App";
import styled from "styled-components";
import { FileDragItem, File } from "./utils/types";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { DragTypes } from "./utils/constants";

type WindowProps = File;

const WindowContainer = styled.div`
  padding-right: 2px;
  padding-left: 2px;
  padding-bottom: 2px;
  padding-top: 2px;
  margin-right: 2px;
  margin-left: 2px;
  text-rendering: optimizeLegibility;
  height: 80vh;
  min-width: 256px;
  width: 50vw;
  cursor: default;
  background-color: silver;
  font-family: ms-sans-serif;
  border-left: 2px solid #dfdfdf;
  border-top: 2px solid #dfdfdf;
  border-right: 2px solid #7f7f7f;
  border-bottom: 2px solid #7f7f7f;
  z-index: 100;
  position: absolute;
`;

const WindowHeader = styled.div`
  background-color: navy;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: 24px;
  align-items: center;
`;

const NotepadIcon = styled.div`
  background-image: url(icons/notepad-0.png);
  background-repeat: no-repeat;
  background-size: cover;
  height: 20px;
  width: 20px;
  padding-right: 2px;
  flex: 0 0 auto;
  padding: 1px;
  margin-right: 4px;
`;

const HeaderText = styled.div`
  font-weight: bold;
  flex: 0 0 auto;
  color: white;
  line-height: 12px;
  font-size: 12px;
`;

const Spacer = styled.div`
  flex: 1 0 auto;
`;

const CloseIcon = styled.div`
  background-image: url(icons/close-icon.png);
  background-repeat: no-repeat;
  background-color: silver;
  background-size: contain;
  border-left: 2px solid #ededed;
  border-top: 2px solid #ededed;
  border-right: 2px solid #404040;
  border-bottom: 2px solid #404040;
  height: 2px;
  width: 2px;
  flex: 0 0 auto;
  margin: 2px;
  padding: 6px;
`;

function getCloseClickHandler({
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
          isOpen: false,
        },
      ]);
    }
  };
}

const DesktopWindow: React.FunctionComponent<WindowProps> = ({
  fileId,
  fileName,
  windowLocation,
}) => {
  const { files, setFiles } = useContext(FileContext);
  const [, drag, dragPreview] = useDrag<
    FileDragItem,
    unknown,
    { isDragging: boolean }
  >(() => ({
    type: DragTypes.window,
    collect: (monitor: DragSourceMonitor<unknown, unknown>) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
    options: {
      dropEffect: "move",
    },
    item: {
      fileId,
      type: DragTypes.window,
    },
  }));

  return (
    <WindowContainer
      ref={dragPreview}
      style={{
        left: windowLocation.x,
        top: windowLocation.y,
      }}
    >
      <WindowHeader ref={drag}>
        <NotepadIcon />
        <HeaderText>{`${fileName} - Notepad`}</HeaderText>
        <Spacer />
        <CloseIcon
          onClick={getCloseClickHandler({ fileId, files, setFiles })}
        />
      </WindowHeader>
    </WindowContainer>
  );
};

export default DesktopWindow;
