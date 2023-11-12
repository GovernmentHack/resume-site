import React, { useContext } from "react";
import Modal from "react-modal";
import { ContextMenuButton } from "./ContextMenuComponents/ContextMenuButton";
import { ContextMenuDivider } from "./ContextMenuComponents/ContextMenuDivider";
import { DisabledMenuItem } from "./ContextMenuComponents/DisabledMenuItem";
import { DragTypes, FileIcon, getContextMenuModalStyle } from "../utils/constants";
import { XYCoord } from "react-dnd";
import styled from "styled-components";
import { generateNewWindowLocation } from "../utils/generateNewWindowLocation";
import { Folder, TextFile, File } from "../utils/types";
import { v4 as uuidv4 } from "uuid";
import { FileContext } from "../App";

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

type newItemClickHandlerProps = {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  files: File[];
  closeModals: () => void;
  location: XYCoord;
  directory: string | null;
};

function getNewFolderClickHandler({
  setFiles,
  files,
  closeModals,
  location,
  directory,
}: newItemClickHandlerProps): React.MouseEventHandler<HTMLDivElement> {
  return (event) => {
    event.stopPropagation();
    const windowLocation = generateNewWindowLocation(files);
    setFiles([
      ...files,
      {
        fileId: uuidv4(),
        icon: FileIcon.closedFolder,
        fileName: "New Folder",
        type: DragTypes.folder,
        location,
        windowLocation,
        isHighlighted: false,
        textIsEditing: true,
        isOpen: false,
        directory,
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
  directory
}: newItemClickHandlerProps): React.MouseEventHandler<HTMLDivElement> {
  return (event) => {
    event.stopPropagation();
    const windowLocation = generateNewWindowLocation(files);
    setFiles([
      ...files,
      {
        fileId: uuidv4(),
        icon: FileIcon.textFile,
        fileName: "New Text Document",
        type: DragTypes.textFile,
        location,
        windowLocation,
        isHighlighted: false,
        textIsEditing: true,
        isOpen: false,
        isEditable: true,
        content: "",
        directory,
      } as TextFile,
    ]);
    closeModals();
  };
}

function getModalStyle(location: { x: number; y: number }): Modal.Styles {
  return getContextMenuModalStyle(location);
}

type WindowContextModalProps = {
  windowContextMenuIsOpen: boolean;
  windowContextMenuLocation: XYCoord;
  setWindowContextMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fileId: newItemClickHandlerProps["directory"];
};

export const WindowContextModal: React.FunctionComponent<WindowContextModalProps> = ({
  windowContextMenuIsOpen,
  windowContextMenuLocation,
  setWindowContextMenuIsOpen,
  fileId,
}) => {
  const { files, setFiles } = useContext(FileContext);
  const [windowNewMenuIsOpen, setWindowNewMenuIsOpen] =
    React.useState(false);
  return (
    <Modal
      isOpen={windowContextMenuIsOpen}
      onRequestClose={() => setWindowContextMenuIsOpen(false)}
      style={getModalStyle(windowContextMenuLocation)}
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
        onMouseEnter={() => setWindowNewMenuIsOpen(true)}
        onMouseLeave={() => setWindowNewMenuIsOpen(false)}
        style={{
          backgroundColor: windowNewMenuIsOpen ? "navy" : undefined,
          color: windowNewMenuIsOpen ? "white" : undefined,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div>
          Ne<u>w</u>
        </div>
        <div>▶</div>
        <Modal
          isOpen={windowNewMenuIsOpen}
          onRequestClose={() => setWindowNewMenuIsOpen(false)}
          style={getModalStyle({
            x: windowContextMenuLocation.x + 164,
            y: windowContextMenuLocation.y + 118,
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
              location: windowContextMenuLocation,
              closeModals: () => {
                setWindowNewMenuIsOpen(false);
                setWindowContextMenuIsOpen(false);
              },
              directory: fileId,
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
              location: windowContextMenuLocation,
              closeModals: () => {
                setWindowNewMenuIsOpen(false);
                setWindowContextMenuIsOpen(false);
              },
              directory: fileId,
            })}
          >
            <NewTextDocumentIcon />
            <div>Text Document</div>
          </ContextMenuButton>
        </Modal>
      </ContextMenuButton>
      <ContextMenuDivider />
    </Modal>
  )
}