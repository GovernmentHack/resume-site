import { DragEventHandler, TouchEventHandler } from "react";
import { XYCoord } from "react-dnd";
import { Property } from "csstype";

export const DragTypes = {
  textFile: "textFile",
  folder: "folder",
  window: "window",
  shortcut: "shortcut",
} as const;

export const FileTypes = {
  textFile: "textFile",
  folder: "folder",
  shortcut: "shortcut",
} as const;

export const FileIcon = {
  closedFolder: "directory_closed_cool-2.png",
  textFile: "notepad_file-0.png",
  executable: "executable_gear-0.png",
} as const;

/** React props to spread to disable dragging interface. Useful for child components you don't want to trigger a drag event */
export const disableDragging: {
  draggable: boolean;
  onDragStart: DragEventHandler<any>;
  onTouchMove: TouchEventHandler<any>;
} = {
  draggable: true,
  onDragStart: (e) => {
    e.stopPropagation();
    e.preventDefault();
  },
  onTouchMove: (e) => {
    e.stopPropagation();
    e.preventDefault();
  },
};

export const getContextMenuModalStyle = (location: XYCoord) => {
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
      zIndex: 10000,
      position: "fixed" as Property.Position,
    },
    overlay: {
      backgroundColor: "unset",
      width: "164px",
      bottom: "auto",
    },
  };
};
