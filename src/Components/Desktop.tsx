import React, { useContext } from "react";
import { DropTargetMonitor, XYCoord, useDrop } from "react-dnd";
import { DragTypes } from "../utils/constants";
import styled from "styled-components";
import { FileContext } from "../App";
import DesktopIcon from "./DesktopIcon";
import TextFileDesktopWindow from "./TextFileDesktopWindow";
import { DesktopFile, FileDragItem } from "../utils/types";
import FolderDesktopWindow from "./FolderDesktopWindow";
import { getWindowClickHandler } from "../utils/getWindowClickHandler";
import { WindowContextModal } from "./WindowContextMenu";

const DRAG_OFFSET_FIX = 17;
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
        DragTypes.textFile,
        DragTypes.folder,
        DragTypes.window,
        DragTypes.shortcut,
      ],
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
            <TextFileDesktopWindow {...file} key={`${file.fileId}-window`} />
          ),
      )}
      {files.map(
        (file) =>
          file.isOpen &&
          file.type === "folder" && (
            <FolderDesktopWindow {...file} key={`${file.fileId}-window`} />
          ),
      )}
      <WindowContextModal
        windowContextMenuIsOpen={desktopContextMenuIsOpen}
        windowContextMenuLocation={desktopContextMenuLocation}
        setWindowContextMenuIsOpen={setDesktopContextMenuIsOpen}
        fileId={null}
      />
    </DesktopDiv>
  );
};

export default Desktop;
