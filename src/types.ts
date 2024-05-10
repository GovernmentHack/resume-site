import { XYCoord } from "react-dnd";
import { FILE_ICON, FILE_TYPE } from "./Components/shared/constants";

export type DragType = keyof typeof FILE_TYPE | "window";

export type FileDragItem = {
  fileId: DesktopFile["fileId"];
  type: DragType;
};

export type Shortcut = {
  fileName: string;
  fileId: string;
  location: XYCoord;
  windowLocation: null;
  windowIsFocused: null;
  isHighlighted: boolean;
  textIsEditing: boolean;
  isOpen: null;
  isMinimized: null;
  content: ({
    files,
    setFiles,
    setLoading,
  }: {
    files: DesktopFile[];
    setFiles: React.Dispatch<React.SetStateAction<DesktopFile[]>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }) => void;
  isEditable: boolean;
  type: typeof FILE_TYPE.shortcut;
  icon: typeof FILE_ICON.executable | typeof FILE_ICON.internetPage;
  directory: string | null;
};

export type TextFile = {
  fileName: string;
  fileId: string;
  location: XYCoord;
  windowLocation: XYCoord;
  windowIsFocused: boolean;
  isHighlighted: boolean;
  textIsEditing: boolean;
  isOpen: boolean;
  isMinimized: boolean;
  content: string;
  isEditable: boolean;
  type: typeof FILE_TYPE.textFile;
  icon: typeof FILE_ICON.textFile;
  directory: string | null;
};

export type Folder = {
  fileName: string;
  fileId: string;
  location: XYCoord;
  windowLocation: XYCoord;
  windowIsFocused: boolean;
  isHighlighted: boolean;
  textIsEditing: boolean;
  isOpen: boolean;
  isMinimized: boolean;
  content: null;
  isEditable: boolean;
  type: typeof FILE_TYPE.folder;
  icon: typeof FILE_ICON.closedFolder;
  directory: string | null;
};

export type DesktopFile = TextFile | Folder | Shortcut;
