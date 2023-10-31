import { XYCoord } from "react-dnd";
import { FileIcon, FileTypes, DragTypes } from "./constants";

export type FileDragItem = {
  fileId: File["fileId"];
  type: (typeof DragTypes)[keyof typeof DragTypes];
};

export type Shortcut = {
  fileName: string;
  fileId: string;
  location: XYCoord;
  windowLocation: null;
  isHighlighted: boolean;
  textIsEditing: boolean;
  isOpen: null;
  content: () => void;
  isEditable: boolean;
  type: typeof FileTypes.shortcut;
  icon: typeof FileIcon.executable;
  directory: string | null;
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
  directory: string | null;
};

export type Folder = {
  fileName: string;
  fileId: string;
  location: XYCoord;
  windowLocation: XYCoord;
  isHighlighted: boolean;
  textIsEditing: boolean;
  isOpen: boolean;
  content: null;
  isEditable: boolean;
  type: typeof FileTypes.folder;
  icon: typeof FileIcon.closedFolder;
  directory: string | null;
};

export type File = TextFile | Folder | Shortcut;
