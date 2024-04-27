import { DesktopFile } from "../../types";

export function getIconClickHandler({
  files,
  setFiles,
  fileId,
}: {
  files: DesktopFile[];
  setFiles: React.Dispatch<React.SetStateAction<DesktopFile[]>>;
  fileId: string;
}): React.MouseEventHandler<HTMLDivElement> {
  return (event) => {
    event.stopPropagation();
    const fileToChange = files.find((file) => file.fileId === fileId);
    const otherFiles = files.filter((file) => file.fileId !== fileId);
    if (fileToChange) {
      const unhighlightedFiles = otherFiles.map((file) => ({
        ...file,
        isHighlighted: false,
      }));
      setFiles([
        ...unhighlightedFiles,
        {
          ...fileToChange,
          isHighlighted: !fileToChange.isHighlighted,
        },
      ]);
    }
  };
}
