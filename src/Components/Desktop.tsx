import React, { useContext } from "react";
import { DropTargetMonitor, XYCoord, useDrop } from "react-dnd";
import { DRAG_TYPE } from "./shared/constants";
import styled from "styled-components";
import { FileContext } from "../App";
import DesktopIcon from "./DesktopIcon";
import TextFileWindow from "./TextFileWindow";
import { DesktopFile, FileDragItem } from "../types";
import FolderWindow from "./FolderWindow";
import { getWindowClickHandler } from "./shared/handlers/getWindowClickHandler";
import { ContextMenu } from "./ContextMenu";

export const DRAG_OFFSET_FIX = 17;
export const INITIAL_WINDOW_LOCATION = { x: 24, y: 24 };

const DesktopDiv = styled.div`
  height: 100%;
`;

const Desktop: React.FunctionComponent = () => {
  const { files, setFiles } = useContext(FileContext);
  const [, drop] = useDrop<
    FileDragItem,
    unknown,
    { canDrop: boolean; isOver: boolean; dropLocation: XYCoord | null }
  >(
    () => ({
      accept: [
        DRAG_TYPE.textFile,
        DRAG_TYPE.folder,
        DRAG_TYPE.window,
        DRAG_TYPE.shortcut,
      ],
      collect: (monitor: DropTargetMonitor<unknown, unknown>) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        dropLocation: monitor.getClientOffset(),
      }),
      drop: (item, monitor) => {
        const endLocation = monitor.getSourceClientOffset();
        const fileToChange = files.find((file) => file.fileId === item.fileId);
        const otherFiles = files.filter((file) => file.fileId !== item.fileId);
        if (fileToChange && endLocation) {
          if (item.type === "window") {
            setFiles([
              ...otherFiles,
              {
                ...fileToChange,
                windowLocation: {
                  x: endLocation.x,
                  y: endLocation.y,
                },
              } as DesktopFile,
            ]);
          } else {
            setFiles([
              ...otherFiles,
              {
                ...fileToChange,
                location: {
                  x: endLocation.x - DRAG_OFFSET_FIX,
                  y: endLocation.y,
                },
                directory: null,
              } as DesktopFile,
            ]);
          }
        }
      },
    }),
    [files],
  );

  const [desktopContextMenuIsOpen, setDesktopContextMenuIsOpen] =
    React.useState(false);
  const [desktopContextMenuLocation, setDesktopContextMenuLocation] =
    React.useState({ x: 0, y: 0 });

  return (
    <DesktopDiv
      data-testid="desktop"
      ref={drop}
      onClick={getWindowClickHandler({
        setWindowContextMenuIsOpen: setDesktopContextMenuIsOpen,
        setFiles,
        setWindowContextMenuLocation: setDesktopContextMenuLocation,
        files,
      })}
      onContextMenu={getWindowClickHandler({
        setWindowContextMenuIsOpen: setDesktopContextMenuIsOpen,
        setFiles,
        setWindowContextMenuLocation: setDesktopContextMenuLocation,
        files,
      })}
    >
      {files.map(
        (file) =>
          file.directory === null && (
            <DesktopIcon {...file} key={file.fileId} />
          ),
      )}
      {files.map(
        (file) =>
          file.isOpen &&
          file.type === "textFile" && (
            <TextFileWindow {...file} key={`${file.fileId}-window`} />
          ),
      )}
      {files.map(
        (file) =>
          file.isOpen &&
          file.type === "folder" && (
            <FolderWindow {...file} key={`${file.fileId}-window`} />
          ),
      )}
      <ContextMenu
        windowContextMenuIsOpen={desktopContextMenuIsOpen}
        windowContextMenuLocation={desktopContextMenuLocation}
        setWindowContextMenuIsOpen={setDesktopContextMenuIsOpen}
        fileId={null}
      />
    </DesktopDiv>
  );
};

export default Desktop;
