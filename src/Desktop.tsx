import React, { useContext } from "react";
import { DropTargetMonitor, XYCoord, useDrop } from "react-dnd";
import {
  DragTypes,
  FileIcon,
  getContextMenuModalStyle,
} from "./utils/constants";
import styled from "styled-components";
import { FileContext } from "./App";
import DesktopIcon from "./DesktopIcon";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";
import TextFileDesktopWindow from "./DesktopWindow";
import { File, FileDragItem, Folder, TextFile } from "./utils/types";
import { DisabledMenuItem } from "./ContextMenuComponents/DisabledMenuItem";
import { ContextMenuButton } from "./ContextMenuComponents/ContextMenuButton";
import { ContextMenuDivider } from "./ContextMenuComponents/ContextMenuDivider";

const DRAG_OFFSET_FIX = 17;

const DesktopDiv = styled.div`
  height: 100%;
`;

const NewFolderButtonIcon = styled.div`
  background-image: url(icons/directory_closed_cool-1.png);
  background-repeat: no-repeat;
  height: 18px;
  width: 18px;
  padding-right: 2px;
`;

const NewTextDocumentIcon = styled.div`
  background-image: url(icons/notepad_file-1.png);
  background-repeat: no-repeat;
  height: 18px;
  width: 18px;
  padding-right: 2px;
`;

function getModalStyle(location: { x: number; y: number }): Modal.Styles {
  return getContextMenuModalStyle(location);
}

function getNewFolderClickHandler({
  setFiles,
  files,
  closeModals,
  location,
}: {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  files: File[];
  closeModals: () => void;
  location: XYCoord;
}): React.MouseEventHandler<HTMLDivElement> {
  return (event) => {
    event.stopPropagation();
    setFiles([
      ...files,
      {
        fileId: uuidv4(),
        icon: FileIcon.closedFolder,
        fileName: "New Folder",
        type: DragTypes.folder,
        location,
        windowLocation: { x: 24, y: 24 },
        isHighlighted: false,
        textIsEditing: true,
        isOpen: false,
      } as Folder,
    ]);
    closeModals();
  };
}

function getNewTextFileClickHandler({
  setFiles,
  files,
  closeModals,
  location,
}: {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  files: File[];
  closeModals: () => void;
  location: XYCoord;
}): React.MouseEventHandler<HTMLDivElement> {
  return (event) => {
    event.stopPropagation();
    setFiles([
      ...files,
      {
        fileId: uuidv4(),
        icon: FileIcon.textFile,
        fileName: "New Text Document",
        type: DragTypes.textFile,
        location,
        windowLocation: { x: 24, y: 24 },
        isHighlighted: false,
        textIsEditing: true,
        isOpen: false,
        isEditable: true,
        content: "",
      } as TextFile,
    ]);
    closeModals();
  };
}

const getDesktopClickHandler: ({
  setDesktopContextMenuIsOpen,
  setFiles,
  setDesktopContextMenuLocation,
  files,
}: {
  setDesktopContextMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  files: File[];
  setDesktopContextMenuLocation: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
}) => React.MouseEventHandler<HTMLDivElement> = ({
  setDesktopContextMenuIsOpen,
  setFiles,
  files,
  setDesktopContextMenuLocation,
}) => {
  return (event) => {
    if (event.type === "contextmenu") {
      setDesktopContextMenuLocation({ x: event.clientX, y: event.clientY });
      setDesktopContextMenuIsOpen(true);
      event.preventDefault();
      event.stopPropagation();
    } else if (event.type === "click") {
      setDesktopContextMenuIsOpen(false);
      const unhighlightedIcons = files.map((file) => ({
        ...file,
        isHighlighted: false,
        textIsEditing: false,
      }));
      setFiles(unhighlightedIcons);
    }
  };
};

const Desktop: React.FunctionComponent = () => {
  const { files, setFiles } = useContext(FileContext);

  const [, drop] = useDrop<
    FileDragItem,
    unknown,
    { canDrop: boolean; isOver: boolean; dropLocation: XYCoord | null }
  >(
    () => ({
      accept: [DragTypes.textFile, DragTypes.folder, DragTypes.window],
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
        const fileToChange = files.find((file) => file.fileId === item.fileId);
        const otherFiles = files.filter((file) => file.fileId !== item.fileId);
        if (fileToChange && endLocation) {
          setFiles([
            ...otherFiles,
            {
              ...fileToChange,
              ...(item.type === "window"
                ? {
                    windowLocation: {
                      x: endLocation.x,
                      y: endLocation.y,
                    },
                  }
                : {
                    location: {
                      x: endLocation.x - DRAG_OFFSET_FIX,
                      y: endLocation.y,
                    },
                  }),
            },
          ]);
        }
      },
    }),
    [files],
  );

  const [desktopContextMenuIsOpen, setDesktopContextMenuIsOpen] =
    React.useState(false);
  const [desktopContextNewMenuIsOpen, setDesktopNewContextMenuIsOpen] =
    React.useState(false);
  const [desktopContextMenuLocation, setDesktopContextMenuLocation] =
    React.useState({ x: 0, y: 0 });

  return (
    <DesktopDiv
      ref={drop}
      onClick={getDesktopClickHandler({
        setDesktopContextMenuIsOpen,
        setFiles,
        setDesktopContextMenuLocation,
        files,
      })}
      onContextMenu={getDesktopClickHandler({
        setDesktopContextMenuIsOpen,
        setFiles,
        setDesktopContextMenuLocation,
        files,
      })}
    >
      {files.map((file) => (
        <DesktopIcon {...file} key={file.fileId} />
      ))}
      {files.map(
        (file) =>
          file.isOpen &&
          file.type === "textFile" && (
            <TextFileDesktopWindow {...file} key={`${file.fileId}-window`} />
          ),
      )}
      <Modal
        isOpen={desktopContextMenuIsOpen}
        onRequestClose={() => setDesktopContextMenuIsOpen(false)}
        style={getModalStyle(desktopContextMenuLocation)}
      >
        <DisabledMenuItem>
          <div>
            <u>V</u>iew
          </div>
          <div>▶</div>
        </DisabledMenuItem>
        <DisabledMenuItem>
          <div>
            S<u>o</u>rt by
          </div>
          <div>▶</div>
        </DisabledMenuItem>
        <ContextMenuButton>
          <div>
            R<u>e</u>fresh
          </div>
        </ContextMenuButton>
        <ContextMenuDivider />
        <DisabledMenuItem>
          <div>
            <u>P</u>aste
          </div>
        </DisabledMenuItem>
        <DisabledMenuItem>
          <div>
            Paste <u>s</u>hortcut
          </div>
        </DisabledMenuItem>
        <ContextMenuDivider />
        <ContextMenuButton
          onMouseEnter={() => setDesktopNewContextMenuIsOpen(true)}
          onMouseLeave={() => setDesktopNewContextMenuIsOpen(false)}
          style={{
            backgroundColor: desktopContextNewMenuIsOpen ? "teal" : undefined,
            color: desktopContextNewMenuIsOpen ? "white" : undefined,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div>
            Ne<u>w</u>
          </div>
          <div>▶</div>
          <Modal
            isOpen={desktopContextNewMenuIsOpen}
            onRequestClose={() => setDesktopNewContextMenuIsOpen(false)}
            style={getModalStyle({
              x: desktopContextMenuLocation.x + 164,
              y: desktopContextMenuLocation.y + 118,
            })}
          >
            <ContextMenuButton
              style={{
                justifyContent: "flex-start",
                paddingLeft: "2px",
              }}
              onClick={getNewFolderClickHandler({
                setFiles,
                files,
                location: desktopContextMenuLocation,
                closeModals: () => {
                  setDesktopNewContextMenuIsOpen(false);
                  setDesktopContextMenuIsOpen(false);
                },
              })}
            >
              <NewFolderButtonIcon />
              <div>
                <u>F</u>older
              </div>
            </ContextMenuButton>
            <ContextMenuDivider />
            <ContextMenuButton
              style={{
                justifyContent: "flex-start",
                paddingLeft: "2px",
              }}
              onClick={getNewTextFileClickHandler({
                setFiles,
                files,
                location: desktopContextMenuLocation,
                closeModals: () => {
                  setDesktopNewContextMenuIsOpen(false);
                  setDesktopContextMenuIsOpen(false);
                },
              })}
            >
              <NewTextDocumentIcon />
              <div>Text Document</div>
            </ContextMenuButton>
          </Modal>
        </ContextMenuButton>
        <ContextMenuDivider />
      </Modal>
    </DesktopDiv>
  );
};

export default Desktop;
