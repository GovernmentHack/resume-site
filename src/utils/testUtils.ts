import { FileTypes, FileIcon } from "./constants";
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
    content:
      "this is a really long string since this is the content for a text file",
    isEditable: true,
    type: FileTypes.textFile,
    icon: FileIcon.textFile,
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
    content: null,
    isEditable: true,
    type: FileTypes.folder,
    icon: FileIcon.closedFolder,
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
    windowsIsFocused: null,
    isHighlighted: false,
    textIsEditing: false,
    isOpen: null,
    content: content,
    isEditable: true,
    type: FileTypes.shortcut,
    icon: FileIcon.executable,
    directory: null,
  };
}
