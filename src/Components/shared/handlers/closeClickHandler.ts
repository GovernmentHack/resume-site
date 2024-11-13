import React from "react";
import { DesktopFile, FileStoreState } from "../../../types";

export function getCloseClickHandler({
  files,
  setFiles,
  fileId,
}: {
  files: DesktopFile[];
  setFiles: FileStoreState["setFiles"];
  fileId: string;
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
          isOpen: false,
          isMinimized: false,
        } as DesktopFile,
      ]);
    }
  };
}
