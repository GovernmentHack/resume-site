import { DragEventHandler } from "react";

export const DragTypes = {
  textFile: "textFile",
  folder: "folder",
  window: "window",
} as const;

export const FileTypes = {
  textFile: "textFile",
  folder: "folder",
} as const;

export const FileIcon = {
  closedFolder: "directory_closed_cool-0.png",
  textFile: "notepad_file-0.png",
} as const;

export const disableDragging: {
  draggable: boolean;
  onDragStart: DragEventHandler<HTMLDivElement>;
} = {
  draggable: true,
  onDragStart: (e) => {
    e.stopPropagation();
    e.preventDefault();
  },
};
