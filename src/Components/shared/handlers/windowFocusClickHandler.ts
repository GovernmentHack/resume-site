import { DesktopFile, FileStoreState } from "../../../types";

export function getWindowFocusClickHandler({
  files,
  setFiles,
  fileId,
}: {
  files: DesktopFile[];
  setFiles: FileStoreState["setFiles"];
  fileId: string;
}) {
  return () => {
    const fileToChange = files.find((file) => file.fileId === fileId);
    const otherFiles: DesktopFile[] = files.filter(
      (file) => file.fileId !== fileId,
    );
    if (
      fileToChange &&
      fileToChange.type !== "shortcut" &&
      !fileToChange.windowIsFocused
    ) {
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
          windowIsFocused: true,
        } as DesktopFile,
      ]);
    }
  };
}
