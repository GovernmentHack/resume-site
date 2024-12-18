import { DesktopFile, FileStoreState } from "../../types";

export function getIconDoubleClickHandler({
  files,
  setFiles,
  setLoading,
  fileId,
}: {
  files: DesktopFile[];
  setFiles: FileStoreState["setFiles"];
  setLoading: FileStoreState["setLoading"];
  fileId: string;
}): React.MouseEventHandler<HTMLDivElement> {
  return (event) => {
    event.stopPropagation();
    const fileToChange = files.find((file) => file.fileId === fileId);
    const otherFiles = files.filter((file) => file.fileId !== fileId);
    if (fileToChange) {
      // "run" a shortcut instead of opening it
      if (fileToChange.type === "shortcut") {
        fileToChange.content({ files, setFiles, setLoading });
      } else {
        const otherFilesWindowClosed = otherFiles.map((file) => {
          if (
            (file.type === "folder" || file.type === "textFile") &&
            file.windowIsFocused
          ) {
            return {
              ...file,
              windowIsFocused: false,
            };
          }
          return file;
        });
        setFiles([
          ...otherFilesWindowClosed,
          {
            ...fileToChange,
            isOpen: true,
            isMinimized: false,
            windowIsFocused: true,
          },
        ]);
      }
    }
  };
}
