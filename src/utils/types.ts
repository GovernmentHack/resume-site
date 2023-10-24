import { XYCoord } from "react-dnd";
import { FileIcon, FileTypes, DragTypes } from "./constants";

export type FileDragItem = {
  fileId: File["fileId"];
  type: (typeof DragTypes)[keyof typeof DragTypes];
};

export type File = {
  icon: (typeof FileIcon)[keyof typeof FileIcon];
  fileName: string;
  type: (typeof FileTypes)[keyof typeof FileTypes];
  fileId: string;
  location: XYCoord;
  windowLocation: XYCoord;
  isHighlighted: boolean;
  textIsEditing: boolean;
  isOpen: boolean;
};
