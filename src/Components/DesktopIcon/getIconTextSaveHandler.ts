import { DesktopFile } from "../../types";

export function getIconTextSaveHandler({
  files,
  setFiles,
  fileId,
  newFileName,
}: {
  files: DesktopFile[];
  setFiles: React.Dispatch<React.SetStateAction<DesktopFile[]>>;
  fileId: string;
  newFileName: string;
}): React.KeyboardEventHandler<HTMLInputElement> {
  return (event) => {
    if (event.key === "Enter") {
      const fileToChange = files.find((file) => file.fileId === fileId);
      const otherFiles = files.filter((file) => file.fileId !== fileId);
      if (fileToChange && fileToChange.textIsEditing) {
        setFiles([
          ...otherFiles,
          {
            ...fileToChange,
            textIsEditing: false,
            isHighlighted: false,
            fileName: newFileName,
          },
        ]);
      }
    }
  };
}
