import { DragEventHandler, TouchEventHandler } from "react";

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
