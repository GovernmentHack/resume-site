import React, { useContext, useState } from "react";
import { FileContext } from "../App";
import styled from "styled-components";
import { FileDragItem, File, TextFile } from "../utils/types";
import { DragSourceMonitor, useDrag } from "react-dnd";
import {
  DragTypes,
  disableDragging,
  getContextMenuModalStyle,
} from "../utils/constants";
import Modal from "react-modal";
import { ContextMenuButton } from "./ContextMenuComponents/ContextMenuButton";
import { ContextMenuDivider } from "./ContextMenuComponents/ContextMenuDivider";
import { DisabledMenuItem } from "./ContextMenuComponents/DisabledMenuItem";

type TextFileWindowProps = TextFile;

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
  display: flex;
  flex-direction: column;
`;

const WindowHeader = styled.div`
  background-color: navy;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: 24px;
  align-items: center;
  flex: 0 0 auto;
`;

const Toolbar = styled.div`
  background-color: silver;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: 24px;
  align-items: center;
  flex: 0 0 auto;
`;

const ToolbarText = styled.div`
  flex: 0 0 auto;
  color: black;
  line-height: 18px;
  font-size: 12px;
  text-align: center;
  padding-left: 8px;
  padding-right: 8px;
  height: 18px;
  border: 2px solid transparent;
  &:hover {
    border-right: 2px solid #dfdfdf;
    border-bottom: 2px solid #dfdfdf;
    border-left: 2px solid #7f7f7f;
    border-top: 2px solid #7f7f7f;
  }
`;

const ToolbarTextDisabled = styled.div`
  flex: 0 0 auto;
  color: white;
  line-height: 18px;
  font-size: 12px;
  text-align: center;
  padding-left: 8px;
  padding-right: 8px;
  height: 18px;
  color: grey;
  border: 2px solid transparent;
  text-shadow: 1px 1px 2px white;
`;

/**
 * Scroll bar styling mostly from from Dakedres: https://gist.github.com/Dakedres/0ccda599648833a1c2f65d3967aa131b
 * Thanks, cause, I got really frstrated getting my own scrollbar style to work 🙃
 */
const TextBox = styled.textarea`
  background-color: white;
  background-size: contain;
  border-right: 2px solid #ededed;
  border-bottom: 2px solid #ededed;
  border-left: 2px solid #404040;
  border-top: 2px solid #404040;
  color: black;
  line-height: 12px;
  font-size: 12px;
  flex: 1;
  margin-left: 1px;
  margin-right: 1px;
  margin-bottom: 1px;
  height: 100px;
  padding: 1px;
  overflow: scroll;
  box-shadow: none;
  resize: none;
  outline: none;

  &::-webkit-scrollbar {
    width: 16px;
    height: 16px;
    background: none;
  }

  &::-webkit-scrollbar-button,
  &::-webkit-scrollbar-thumb {
    width: 16px;
    height: 16px;
    background: silver;
    box-shadow:
      inset 1px 1px #dfdfdf,
      inset -1px -1px gray;
    border: 1px solid;
    border-color: silver #000 #000 silver;
  }

  &::-webkit-scrollbar-track {
    image-rendering: optimizeSpeed;
    image-rendering: pixelated;
    image-rendering: optimize-contrast;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTAuNSAyIDIiIHNoYXBlLXJlbmRlcmluZz0iY3Jpc3BFZGdlcyI+CjxtZXRhZGF0YT5NYWRlIHdpdGggUGl4ZWxzIHRvIFN2ZyBodHRwczovL2NvZGVwZW4uaW8vc2hzaGF3L3Blbi9YYnh2Tmo8L21ldGFkYXRhPgo8cGF0aCBzdHJva2U9IiNjMGMwYzAiIGQ9Ik0wIDBoMU0xIDFoMSIgLz4KPC9zdmc+");
    background-position: 0 0;
    background-repeat: repeat;
    background-size: 2px;
  }

  &::-webkit-scrollbar-button {
    background-repeat: no-repeat;
    background-size: 16px;
    background-position: 0 0;
  }

  &::-webkit-scrollbar-button:horizontal:end:increment,
  &::-webkit-scrollbar-button:horizontal:start:decrement,
  &::-webkit-scrollbar-button:vertical:end:increment,
  &::-webkit-scrollbar-button:vertical:start:decrement {
    display: block;
  }

  &::-webkit-scrollbar-button:single-button:vertical:decrement,
  &::-webkit-scrollbar-button:single-button:vertical:increment,
  &::-webkit-scrollbar-button:single-button:horizontal:decrement,
  &::-webkit-scrollbar-button:single-button:horizontal:increment {
    display: block;
  }

  &::-webkit-scrollbar-button:single-button:vertical:decrement,
  &::-webkit-scrollbar-button:vertical:start:decrement {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTAuNSAxNiAxNiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KPG1ldGFkYXRhPk1hZGUgd2l0aCBQaXhlbHMgdG8gU3ZnIGh0dHBzOi8vY29kZXBlbi5pby9zaHNoYXcvcGVuL1hieHZOajwvbWV0YWRhdGE+CjxwYXRoIHN0cm9rZT0iIzAwMDAwMCIgZD0iTTcgNWgxTTYgNmgzTTUgN2g1TTQgOGg3IiAvPgo8L3N2Zz4=");
  }

  &::-webkit-scrollbar-button:single-button:vertical:increment,
  &::-webkit-scrollbar-button:vertical:end:increment {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTAuNSAxNiAxNiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KPG1ldGFkYXRhPk1hZGUgd2l0aCBQaXhlbHMgdG8gU3ZnIGh0dHBzOi8vY29kZXBlbi5pby9zaHNoYXcvcGVuL1hieHZOajwvbWV0YWRhdGE+CjxwYXRoIHN0cm9rZT0iIzAwMDAwMCIgZD0iTTQgNWg3TTUgNmg1TTYgN2gzTTcgOGgxIiAvPgo8L3N2Zz4=");
  }

  &::-webkit-scrollbar-button:single-button:horizontal:decrement,
  &::-webkit-scrollbar-button:horizontal:start:decrement {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTAuNSAxNiAxNiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KPG1ldGFkYXRhPk1hZGUgd2l0aCBQaXhlbHMgdG8gU3ZnIGh0dHBzOi8vY29kZXBlbi5pby9zaHNoYXcvcGVuL1hieHZOajwvbWV0YWRhdGE+CjxwYXRoIHN0cm9rZT0iIzAwMDAwMCIgZD0iTTggM2gxTTcgNGgyTTYgNWgzTTUgNmg0TTYgN2gzTTcgOGgyTTggOWgxIiAvPgo8L3N2Zz4=");
  }

  &::-webkit-scrollbar-button:single-button:horizontal:increment,
  &::-webkit-scrollbar-button:horizontal:end:increment {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgLTAuNSAxNiAxNiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KPG1ldGFkYXRhPk1hZGUgd2l0aCBQaXhlbHMgdG8gU3ZnIGh0dHBzOi8vY29kZXBlbi5pby9zaHNoYXcvcGVuL1hieHZOajwvbWV0YWRhdGE+CjxwYXRoIHN0cm9rZT0iIzAwMDAwMCIgZD0iTTYgM2gxTTYgNGgyTTYgNWgzTTYgNmg0TTYgN2gzTTYgOGgyTTYgOWgxIiAvPgo8L3N2Zz4=");
  }

  &::-webkit-scrollbar-corner {
    background: silver;
  }
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

const CloseIcon = styled.button`
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
  &:active {
    border-right: 2px solid #ededed;
    border-bottom: 2px solid #ededed;
    border-left: 2px solid #404040;
    border-top: 2px solid #404040;
  }
`;

function getCloseClickHandler({
  files,
  setFiles,
  fileId,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  fileId: string;
}): React.MouseEventHandler<any> {
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
        } as TextFile,
      ]);
    }
  };
}

function getSaveFileClickHandler({
  files,
  setFiles,
  fileId,
  closeMenu,
  newContent,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  fileId: string;
  closeMenu: () => void;
  newContent: string;
}): React.MouseEventHandler<HTMLDivElement> {
  return (event) => {
    event.stopPropagation();
    closeMenu();
    const fileToChange = files.find((file) => file.fileId === fileId);
    const otherFiles = files.filter((file) => file.fileId !== fileId);
    if (fileToChange) {
      setFiles([
        ...otherFiles,
        {
          ...fileToChange,
          content: newContent,
        } as TextFile,
      ]);
    }
  };
}

function getModalStyle(location: { x: number; y: number }): Modal.Styles {
  return getContextMenuModalStyle(location);
}

const TextFileDesktopWindow: React.FunctionComponent<TextFileWindowProps> = ({
  fileId,
  fileName,
  windowLocation,
  content,
  isEditable,
}) => {
  const { files, setFiles } = useContext(FileContext);
  const [fileMenuIsOpen, setFileMenuIsOpen] = useState(false);
  const [tempTextContent, setTempTextContent] = useState(content);
  const [{ isDragging }, drag] = useDrag<
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
      ref={drag}
      style={{
        left: windowLocation.x,
        top: windowLocation.y,
        opacity: isDragging ? 0 : 1,
        zIndex: 0,
      }}
      onClick={() => setFileMenuIsOpen(false)}
    >
      <WindowHeader>
        <NotepadIcon />
        <HeaderText>{`${fileName} - Notepad`}</HeaderText>
        <Spacer />
        <CloseIcon
          onClick={getCloseClickHandler({ fileId, files, setFiles })}
        />
      </WindowHeader>
      <Toolbar {...disableDragging}>
        <ToolbarText
          onClick={(event) => {
            setFileMenuIsOpen(true);
            event.stopPropagation();
          }}
          style={
            fileMenuIsOpen
              ? {
                  borderRight: "2px solid #dfdfdf",
                  borderBottom: "2px solid #dfdfdf",
                  borderLeft: "2px solid #7f7f7f",
                  borderTop: "2px solid #7f7f7f",
                }
              : {}
          }
        >
          File
        </ToolbarText>
        <ToolbarTextDisabled>Edit</ToolbarTextDisabled>
        <ToolbarTextDisabled>Search</ToolbarTextDisabled>
        <ToolbarTextDisabled>Help</ToolbarTextDisabled>
      </Toolbar>
      <TextBox
        {...disableDragging}
        value={tempTextContent}
        onChange={(event) => {
          setTempTextContent(event.target.value);
        }}
        readOnly={!isEditable}
      />
      <Modal
        isOpen={fileMenuIsOpen}
        onRequestClose={() => setFileMenuIsOpen(false)}
        style={getModalStyle({
          x: windowLocation.x + 8,
          y: windowLocation.y + 52,
        })}
      >
        <DisabledMenuItem>
          <div>
            <u>N</u>ew
          </div>
          <div>Ctrl+N</div>
        </DisabledMenuItem>
        <DisabledMenuItem>
          <div>
            <u>O</u>pen
          </div>
          <div>Ctrl+O</div>
        </DisabledMenuItem>
        <ContextMenuButton
          onClick={getSaveFileClickHandler({
            fileId,
            files,
            setFiles,
            newContent: tempTextContent,
            closeMenu: () => setFileMenuIsOpen(false),
          })}
        >
          <div>
            <u>S</u>ave
          </div>
          <div>Ctrl+S</div>
        </ContextMenuButton>
        <DisabledMenuItem>
          <div>
            Save <u>A</u>s
          </div>
          <div>Ctrl+Shift+S</div>
        </DisabledMenuItem>
        <ContextMenuDivider />
        <ContextMenuButton
          onClick={getCloseClickHandler({ fileId, files, setFiles })}
        >
          <div>
            E<u>x</u>it
          </div>
        </ContextMenuButton>
      </Modal>
    </WindowContainer>
  );
};

export default TextFileDesktopWindow;
