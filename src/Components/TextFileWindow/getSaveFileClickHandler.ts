import React from "react";
import { DesktopFile, TextFile } from "../../types";

export function getSaveFileClickHandler({
  files,
  setFiles,
  fileId,
  closeMenu,
  newContent,
}: {
  files: DesktopFile[];
  setFiles: React.Dispatch<React.SetStateAction<DesktopFile[]>>;
  fileId: string;
  closeMenu: () => void;
  newContent: string;
}): React.MouseEventHandler<HTMLDivElement> {
  return (event) => {
    event.stopPropagation();
    closeMenu();
    const fileToChange = files.find((file) => file.fileId === fileId);
    const otherFiles = files.filter((file) => file.fileId !== fileId);
    if (fileToChange) {
      setFiles([
        ...otherFiles,
        {
          ...fileToChange,
          content: newContent,
        } as TextFile,
      ]);
    }
  };
}
