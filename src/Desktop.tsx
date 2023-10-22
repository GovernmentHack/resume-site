import React, { ReactNode, useContext } from "react";
import { DropTargetMonitor, XYCoord, useDrop } from 'react-dnd'
import { DragTypes, FileIcon } from "./utils/constants";
import styled from 'styled-components';
import { FileContext, File } from './App';
import DesktopIcon from './DesktopIcon';
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";

const DesktopDiv = styled.div`
  height: 100%;
`

const Divider = styled.div`
  border-top: 1px solid #7f7f7f;
  border-bottom: 2px solid #dfdfdf;
  height: 0px;
  margin-right: 2px;
  margin-left: 2px;
  margin-top: 3px;
  margin-bottom: 3px;
`

const ContextMenuButton = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding-right: 4px;
  padding-left: 16px;
  padding-bottom: 3px;
  padding-top: 1px;
  margin-right: 2px;
  margin-left: 2px;
  letter-spacing: -.025em;
  text-rendering: optimizeLegibility;
  height: 16px;
  cursor: default;
  &:hover {
    background-color: teal;
    color: white;
  }
`

const DisabledMenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding-right: 4px;
  padding-left: 16px;
  padding-bottom: 3px;
  padding-top: 1px;
  margin-right: 2px;
  margin-left: 2px;
  letter-spacing: -.025em;
  text-rendering: optimizeLegibility;
  height: 16px;
  color: grey;
  text-shadow: 1px 1px 2px white;
  cursor: default;
`

const NewFolderButtonIcon = styled.div`
  background-image: url(icons/directory_closed_cool-1.png);
  background-repeat: no-repeat;
  height: 18px;
  width: 18px;
  padding-right: 2px;
`

const NewTextDocumentIcon = styled.div`
  background-image: url(icons/notepad_file-1.png);
  background-repeat: no-repeat;
  height: 18px;
  width: 18px;
  padding-right: 2px;
`

function getModalStyle(location: {x: number, y: number}): Modal.Styles {
  return {
    content: {
      width: "164px",
      bottom: "auto",
      top: location.y,
      left: location.x,
      borderLeft: "2px solid #dfdfdf",
      borderTop: "2px solid #dfdfdf",
      borderRight: "2px solid #7f7f7f",
      borderBottom: "2px solid #7f7f7f",
      backgroundColor: "silver",
      borderRadius: 0,
      padding: "0",
      fontFamily: "px_sans_nouveaux",
      fontSize: "9px",
    },
    overlay: {
      backgroundColor: "unset",
      width: "164px",
      bottom: "auto",
    }
  }
};

function handleNewFolderClick(
  {setFiles, files, closeModals, location}:
  {
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    files: File[],
    closeModals: () => void,
    location: XYCoord,
  }) {
  closeModals();
  setFiles([...files,
    {
      fileId: uuidv4(),
      icon: FileIcon.closedFolder,
      fileName: "New Folder",
      type: DragTypes.folder,
      location,
    }
  ]);
}

const handleClick: ({setDesktopContextMenuIsOpen, setFiles, setDesktopContextMenuLocation}:
  {
    setDesktopContextMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    setDesktopContextMenuLocation: React.Dispatch<React.SetStateAction<{x: number; y: number}>>
  }) => React.MouseEventHandler<HTMLDivElement> = 
  ({setDesktopContextMenuIsOpen, setFiles, setDesktopContextMenuLocation}) => {
    return (event) => {
      if (event.type === 'contextmenu') {
        setDesktopContextMenuLocation({x: event.clientX, y: event.clientY});
        setDesktopContextMenuIsOpen(true);
        event.preventDefault();
        event.stopPropagation();
      }
      else {
        setDesktopContextMenuIsOpen(false);
      }
    }
};

const Desktop: React.FunctionComponent = () => {
  const [{ canDrop, isOver, dropLocation }, drop] = useDrop(() => ({
    accept: [DragTypes.file, DragTypes.folder],
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
      return endLocation;
    },
  }));

  const {files, setFiles} = useContext(FileContext);
  const [desktopContextMenuIsOpen, setDesktopContextMenuIsOpen] = React.useState(false);
  const [desktopContextNewMenuIsOpen, setDesktopNewContextMenuIsOpen] = React.useState(false);
  const [desktopContextMenuLocation, setDesktopContextMenuLocation] = React.useState({x: 0, y: 0});

  return (
    <DesktopDiv
      ref={drop}
      onClick={handleClick({setDesktopContextMenuIsOpen, setFiles, setDesktopContextMenuLocation})}
      onContextMenu={handleClick({setDesktopContextMenuIsOpen, setFiles, setDesktopContextMenuLocation})}
    >
      {files.map((file) => <DesktopIcon fileId={file.fileId} fileName={file.fileName} icon={file.icon} type={file.type} initialLocation={file.location}/>)}
      <Modal
        isOpen={desktopContextMenuIsOpen}
        onRequestClose={() => setDesktopContextMenuIsOpen(false)}
        style={getModalStyle(desktopContextMenuLocation)}
      >
        <DisabledMenuItem>
          <div><u>V</u>iew</div>
          <div>▶</div>
        </DisabledMenuItem>
        <DisabledMenuItem>
          <div>S<u>o</u>rt by</div>
          <div>▶</div>
        </DisabledMenuItem>
        <ContextMenuButton>
          <div>R<u>e</u>fresh</div>
        </ContextMenuButton>
        <Divider />
        <DisabledMenuItem>
          <div><u>P</u>aste</div>
        </DisabledMenuItem>
        <DisabledMenuItem>
          <div>Paste <u>s</u>hortcut</div>
        </DisabledMenuItem>
        <Divider />
        <ContextMenuButton
          onMouseEnter={() => setDesktopNewContextMenuIsOpen(true)}
          onMouseLeave={() => setDesktopNewContextMenuIsOpen(false)}
          style={{
            backgroundColor: desktopContextNewMenuIsOpen ? "teal" : undefined,
            color: desktopContextNewMenuIsOpen ? "white": undefined 
          }}
        >
          <div>Ne<u>w</u></div>
          <div>▶</div>
          <Modal
            isOpen={desktopContextNewMenuIsOpen}
            onRequestClose={() => setDesktopNewContextMenuIsOpen(false)}
            style={getModalStyle({x: desktopContextMenuLocation.x+164, y: desktopContextMenuLocation.y+108})}
          >
            <ContextMenuButton
              style={{
                justifyContent: "flex-start",
                paddingLeft: "2px",
              }}
              onClick={() => handleNewFolderClick(
                {
                  setFiles,
                  files,
                  location: desktopContextMenuLocation,
                  closeModals: () => {
                    setDesktopNewContextMenuIsOpen(false);
                    setDesktopContextMenuIsOpen(false);
                  }
                }
              )
            }
            >
              <NewFolderButtonIcon/>
              <div><u>F</u>older</div>
            </ContextMenuButton>
            <Divider />
            <DisabledMenuItem
              style={{
                justifyContent: "flex-start",
                paddingLeft: "2px",
              }}
            >
              <NewTextDocumentIcon />
              <div>Text Document</div>
            </DisabledMenuItem>
          </Modal>
        </ContextMenuButton>
        <Divider />
      </Modal>
    </DesktopDiv>
  );
}

export default Desktop;