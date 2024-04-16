import React from "react";
import { DragTypes, FileIcon, FileTypes } from "../../utils/constants";
import { generateNewWindowLocation } from "../../utils/generateNewWindowLocation";
import { DesktopFile, Folder, TextFile } from "../../utils/types";
import { v4 as uuidv4 } from "uuid";

export type newItemClickHandlerProps = {
  setFiles: React.Dispatch<React.SetStateAction<DesktopFile[]>>;
  files: DesktopFile[];
  closeModals: () => void;
  location: DesktopFile["location"];
  directory: DesktopFile["directory"];
  type: DesktopFile["type"];
};

export function getNewButtonClickHandler({
  setFiles,
  files,
  closeModals,
  location,
  directory,
  type,
}: newItemClickHandlerProps): React.MouseEventHandler<HTMLDivElement> {
  return (event) => {
    event.stopPropagation();
    const windowLocation = generateNewWindowLocation(files);
    const newFile = createNewFile({
      windowLocation,
      location,
      directory,
      type,
    });
    if (newFile) {
      setFiles([...files, newFile]);
    }
    closeModals();
  };
}

type CreateNewFileParams = Pick<
  DesktopFile,
  "windowLocation" | "location" | "directory" | "type"
>;

function createNewFile({
  windowLocation,
  location,
  directory,
  type,
}: CreateNewFileParams): DesktopFile | undefined {
  switch (type) {
    case FileTypes.textFile:
      return {
        fileId: uuidv4(),
        icon: FileIcon.textFile,
        fileName: "New Text Document",
        type: DragTypes.textFile,
        location,
        windowLocation,
        windowIsFocused: false,
        isHighlighted: false,
        textIsEditing: true,
        isOpen: false,
        isEditable: true,
        content: "",
        directory,
      } as TextFile;
    case FileTypes.folder:
      return {
        fileId: uuidv4(),
        icon: FileIcon.closedFolder,
        fileName: "New Folder",
        type: DragTypes.folder,
        location,
        windowLocation,
        isHighlighted: false,
        textIsEditing: true,
        isOpen: false,
        directory,
        windowIsFocused: false,
        isEditable: true,
      } as Folder;
    default:
      return undefined;
  }
}
