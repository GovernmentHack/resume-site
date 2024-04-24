import React, { useContext, useState } from "react";
import { FileContext } from "../../App";
import { FileDragItem, Folder } from "../../types";
import {
  DragSourceMonitor,
  DropTargetMonitor,
  XYCoord,
  useDrag,
  useDrop,
} from "react-dnd";
import { DRAG_TYPE } from "../shared/constants";
import { getContextMenuModalStyle } from "../shared/handlers/getContextMenuModalStyle";
import Modal from "react-modal";
import { ContextMenuButton } from "../shared/ContextMenuButton";
import { ContextMenuDivider } from "../shared/ContextMenuDivider";
import { DisabledMenuItem } from "../shared/DisabledMenuItem";
import DesktopIcon from "../DesktopIcon";
import { getWindowFocusClickHandler } from "../shared/handlers/windowFocusClickHandler";
import { getWindowClickHandler } from "../shared/handlers/getWindowClickHandler";
import { ContextMenu } from "../ContextMenu";
import { ContentArea } from "./ContentArea";
import { WindowContainer } from "../shared/WindowContainer";
import { Header } from "../shared/Header";
import { Toolbar } from "./Toolbar";
import { AddressBar } from "./AddressBar";
import { FolderExplorerIcon } from "../shared/icons/FolderExplorerIcon";
import { getCloseClickHandler } from "../shared/handlers/closeClickHandler";

type FolderWindowProps = Pick<
  Folder,
  "fileId" | "fileName" | "windowIsFocused" | "windowLocation"
>;

function getModalStyle(location: { x: number; y: number }): Modal.Styles {
  return getContextMenuModalStyle(location);
}

const FolderWindow: React.FunctionComponent<FolderWindowProps> = ({
  fileId,
  fileName,
  windowLocation,
  windowIsFocused,
}) => {
  const { files, setFiles } = useContext(FileContext);
  const [fileMenuIsOpen, setFileMenuIsOpen] = useState(false);
  const [windowContextMenuIsOpen, setWindowContextMenuIsOpen] =
    React.useState(false);
  const [windowContextMenuLocation, setWindowContextMenuLocation] =
    React.useState({ x: 0, y: 0 });
  const [{ isDragging }, drag] = useDrag<
    FileDragItem,
    unknown,
    { isDragging: boolean }
  >(() => ({
    type: DRAG_TYPE.window,
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
      type: DRAG_TYPE.window,
    },
  }));
  const [, drop] = useDrop<
    FileDragItem,
    unknown,
    { canDrop: boolean; isOver: boolean; dropLocation: XYCoord | null }
  >(
    () => ({
      accept: [DRAG_TYPE.textFile, DRAG_TYPE.folder, DRAG_TYPE.shortcut],
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
        console.log("Dropping item", item);
        if (item.fileId === fileId) {
          console.log("No recursive folders :(", item);
          return;
        }
        const fileToChange = files.find((file) => file.fileId === item.fileId);
        const otherFiles = files.filter((file) => file.fileId !== item.fileId);
        if (fileToChange && endLocation) {
          const relativeLocation = {
            x: endLocation.x - windowLocation.x,
            y: endLocation.y - windowLocation.y,
          };
          if (relativeLocation.y < 81 || relativeLocation.x < 2) {
            return;
          }
          setFiles([
            ...otherFiles,
            {
              ...fileToChange,
              location: relativeLocation,
              directory: fileId,
            },
          ]);
        }
      },
    }),
    [files],
  );

  const closeClickHandler = getCloseClickHandler({ fileId, files, setFiles });

  return (
    <div
      data-testid={`${fileId}_folder_window_container`}
      ref={drag}
      style={{
        left: windowLocation.x,
        top: windowLocation.y,
        opacity: isDragging ? 0 : 1,
        zIndex: windowIsFocused ? 1 : 0,
        position: "absolute",
      }}
      onDragStart={getWindowFocusClickHandler({ files, fileId, setFiles })}
      onClick={(event) => {
        setFileMenuIsOpen(false);
        getWindowFocusClickHandler({ files, fileId, setFiles })();
        event.stopPropagation();
      }}
    >
      <WindowContainer ref={drop}>
        <Header
          Icon={FolderExplorerIcon}
          headerText={`Exploring - C:\\${fileName}`}
          onCloseClick={closeClickHandler}
        />
        <Toolbar
          onFileClick={(event) => {
            event.stopPropagation();
            setFileMenuIsOpen(true);
          }}
          fileMenuIsOpen={fileMenuIsOpen}
        />
        <AddressBar fileName={fileName} />
        <ContentArea
          onContextMenu={getWindowClickHandler({
            setWindowContextMenuIsOpen,
            setWindowContextMenuLocation,
            setFiles,
            files,
          })}
          onClick={getWindowClickHandler({
            setWindowContextMenuIsOpen,
            setWindowContextMenuLocation,
            setFiles,
            files,
          })}
        >
          {files.map(
            (file) =>
              file.directory === fileId && (
                <DesktopIcon {...file} key={file.fileId} />
              ),
          )}
          <ContextMenu
            windowContextMenuIsOpen={windowContextMenuIsOpen}
            windowContextMenuLocation={windowContextMenuLocation}
            setWindowContextMenuIsOpen={setWindowContextMenuIsOpen}
            fileId={fileId}
          />
        </ContentArea>
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
          <DisabledMenuItem>
            <div>
              <u>S</u>ave
            </div>
            <div>Ctrl+S</div>
          </DisabledMenuItem>
          <DisabledMenuItem>
            <div>
              Save <u>A</u>s
            </div>
            <div>Ctrl+Shift+S</div>
          </DisabledMenuItem>
          <ContextMenuDivider />
          <ContextMenuButton onClick={closeClickHandler}>
            <div>
              E<u>x</u>it
            </div>
          </ContextMenuButton>
        </Modal>
      </WindowContainer>
    </div>
  );
};

export default FolderWindow;
