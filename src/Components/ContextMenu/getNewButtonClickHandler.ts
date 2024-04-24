import React from "react";
import { FILE_ICON, FILE_TYPE } from "../shared/constants";
import { generateNewWindowLocation } from "../shared/handlers/generateNewWindowLocation";
import { DesktopFile, Folder, TextFile } from "../../types";
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
    case FILE_TYPE.textFile:
      return {
        fileId: uuidv4(),
        icon: FILE_ICON.textFile,
        fileName: "New Text Document",
        type: FILE_TYPE.textFile,
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
    case FILE_TYPE.folder:
      return {
        fileId: uuidv4(),
        icon: FILE_ICON.closedFolder,
        fileName: "New Folder",
        type: FILE_TYPE.folder,
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
