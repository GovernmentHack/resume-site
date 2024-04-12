import { File } from "../../utils/types";

export function getIconTextSaveHandler({
  files,
  setFiles,
  fileId,
  newFileName,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
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
