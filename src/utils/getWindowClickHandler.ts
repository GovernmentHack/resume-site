import React from "react";
import { DesktopFile } from "./types";

export const getWindowClickHandler: ({
  setWindowContextMenuIsOpen,
  setFiles,
  setWindowContextMenuLocation,
  files,
}: {
  setWindowContextMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setWindowContextMenuLocation: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
  files: DesktopFile[];
  setFiles: React.Dispatch<React.SetStateAction<DesktopFile[]>>;
}) => React.MouseEventHandler<HTMLDivElement> = ({
  setWindowContextMenuIsOpen,
  setWindowContextMenuLocation,
  files,
  setFiles,
}) => {
  return (event) => {
    if (event.type === "contextmenu") {
      setWindowContextMenuLocation({ x: event.clientX, y: event.clientY });
      setWindowContextMenuIsOpen(true);
      event.preventDefault();
      event.stopPropagation();
    } else if (event.type === "click") {
      setWindowContextMenuIsOpen(false);
      const unhighlightedIcons = files.map((file) => ({
        ...file,
        isHighlighted: false,
        textIsEditing: false,
      }));
      setFiles(unhighlightedIcons);
    }
  };
};
