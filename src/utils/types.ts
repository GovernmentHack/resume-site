import { XYCoord } from "react-dnd";
import { FileIcon, FileTypes, DragTypes } from "./constants";

export type FileDragItem = {
  fileId: File["fileId"];
  type: (typeof DragTypes)[keyof typeof DragTypes];
};

export type TextFile = {
  fileName: string;
  fileId: string;
  location: XYCoord;
  windowLocation: XYCoord;
  isHighlighted: boolean;
  textIsEditing: boolean;
  isOpen: boolean;
  content: string;
  isEditable: boolean;
  type: typeof FileTypes.textFile;
  icon: typeof FileIcon.textFile;
};

export type Folder = {
  fileName: string;
  fileId: string;
  location: XYCoord;
  windowLocation: XYCoord;
  isHighlighted: boolean;
  textIsEditing: boolean;
  isOpen: boolean;
  content: never;
  isEditable: never;
  type: typeof FileTypes.folder;
  icon: typeof FileIcon.closedFolder;
};

export type File = TextFile | Folder;
