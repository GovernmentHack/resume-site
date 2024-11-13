import React from "react";
import { DesktopFile, FileStoreState } from "../../../types";

export function getMinimizeClickHandler({
  files,
  setFiles,
  fileId,
  shouldToggle = false,
}: {
  files: DesktopFile[];
  setFiles: FileStoreState["setFiles"];
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
