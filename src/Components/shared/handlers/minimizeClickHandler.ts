import React from "react";
import { DesktopFile } from "../../../types";

export function getMinimizeClickHandler({
  files,
  setFiles,
  fileId,
  shouldToggle = false,
}: {
  files: DesktopFile[];
  setFiles: React.Dispatch<React.SetStateAction<DesktopFile[]>>;
  fileId: string;
  shouldToggle?: boolean;
}): React.MouseEventHandler<any> {
  return (event) => {
    event.stopPropagation();
    const fileToChange = files.find((file) => file.fileId === fileId);
    const otherFiles = files.filter((file) => file.fileId !== fileId);
    if (fileToChange) {
      setFiles([
        ...otherFiles,
        {
          ...fileToChange,
          isOpen: shouldToggle ? !fileToChange.isOpen : false,
          isMinimized: true,
          windowIsFocused: false,
        } as DesktopFile,
      ]);
    }
  };
}
