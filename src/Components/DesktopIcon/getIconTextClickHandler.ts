import { DesktopFile, FileStoreState } from "../../types";

export function getIconTextClickHandler({
  files,
  setFiles,
  fileId,
}: {
  files: DesktopFile[];
  setFiles: FileStoreState["setFiles"];
  fileId: string;
}): React.MouseEventHandler<HTMLDivElement> {
  return (event) => {
    const fileToChange = files.find((file) => file.fileId === fileId);
    const otherFiles = files.filter((file) => file.fileId !== fileId);
    if (!fileToChange?.textIsEditing && fileToChange?.isHighlighted) {
      event.stopPropagation();
      setFiles([
        ...otherFiles.map((file) => ({
          ...file,
          textIsEditing: false,
        })),
        {
          ...fileToChange,
          textIsEditing: !fileToChange.textIsEditing,
        },
      ]);
    }
  };
}
