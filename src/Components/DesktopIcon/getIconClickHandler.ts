import { File } from "../../utils/types";

export function getIconClickHandler({
  files,
  setFiles,
  fileId,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  fileId: string;
}): React.MouseEventHandler<HTMLDivElement> {
  return (event) => {
    event.stopPropagation();
    const fileToChange = files.find((file) => file.fileId === fileId);
    const otherFiles = files.filter((file) => file.fileId !== fileId);
    if (fileToChange) {
      setFiles([
        ...otherFiles,
        {
          ...fileToChange,
          isHighlighted: !fileToChange.isHighlighted,
        },
      ]);
    }
  };
}
