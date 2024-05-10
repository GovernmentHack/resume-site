import { FILE_TYPE, FILE_ICON } from "./Components/shared/constants";
import { TextFile, Folder, Shortcut } from "./types";

export function getMockTextFile(): TextFile {
  return {
    fileName: "some text file",
    fileId: "text_file_id",
    location: {
      x: 1,
      y: 1,
    },
    windowLocation: {
      x: 1,
      y: 1,
    },
    windowIsFocused: false,
    isHighlighted: false,
    textIsEditing: false,
    isOpen: false,
    isMinimized: false,
    content:
      "this is a really long string since this is the content for a text file",
    isEditable: true,
    type: FILE_TYPE.textFile,
    icon: FILE_ICON.textFile,
    directory: null,
  };
}

export function getMockFolder(): Folder {
  return {
    fileName: "some folder",
    fileId: "folder_file_id",
    location: {
      x: 1,
      y: 1,
    },
    windowLocation: {
      x: 1,
      y: 1,
    },
    windowIsFocused: false,
    isHighlighted: false,
    textIsEditing: false,
    isOpen: false,
    isMinimized: false,
    content: null,
    isEditable: true,
    type: FILE_TYPE.folder,
    icon: FILE_ICON.closedFolder,
    directory: null,
  };
}

export function getMockShortcut(content: Shortcut["content"]): Shortcut {
  return {
    fileName: "some shortcut",
    fileId: "shortcut_file_id",
    location: {
      x: 1,
      y: 1,
    },
    windowLocation: null,
    windowIsFocused: null,
    isHighlighted: false,
    textIsEditing: false,
    isOpen: null,
    isMinimized: null,
    content: content,
    isEditable: true,
    type: FILE_TYPE.shortcut,
    icon: FILE_ICON.executable,
    directory: null,
  };
}
