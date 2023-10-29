import { File, Folder, TextFile } from "../utils/types";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import { DragTypes, FileIcon } from "./constants";
import { XYCoord } from "react-dnd";

const BASE_DIR = "../resume";

function addFolder({
  files,
  folderName,
  location,
  directory,
}: {
  files: File[];
  folderName: string;
  location: XYCoord;
  directory: string | null;
}): Folder {
  const newFolder: Folder = {
    fileId: uuidv4(),
    icon: FileIcon.closedFolder,
    fileName: folderName,
    type: DragTypes.folder,
    location,
    windowLocation: { x: 24, y: 24 },
    isHighlighted: false,
    textIsEditing: true,
    isOpen: false,
    isEditable: false,
    content: null,
    directory,
  };
  files.push(newFolder);
  return newFolder;
}

function addTextFile({
  files,
  fileName,
  location,
  directory,
  content,
}: {
  files: File[];
  fileName: string;
  location: XYCoord;
  directory: string | null;
  content: string;
}): TextFile {
  const newTextFile: TextFile = {
    fileId: uuidv4(),
    icon: FileIcon.textFile,
    fileName,
    type: DragTypes.textFile,
    location,
    windowLocation: { x: 24, y: 24 },
    isHighlighted: false,
    textIsEditing: true,
    isOpen: false,
    isEditable: false,
    content,
    directory,
  };
  files.push(newTextFile);
  return newTextFile;
}

async function handleFolder({
  directoryPath,
  files,
  location,
  directory,
}: {
  directoryPath: string;
  files: File[];
  location: XYCoord;
  directory: string | null;
}) {
  const rootDirFiles = await fs.readdir(directoryPath);
  for (const filePath of rootDirFiles) {
    const path = `${rootDirFiles}/${filePath}`;
    const isDirectory: boolean = (await fs.lstat(path)).isDirectory();
    if (isDirectory) {
      const newFolder = addFolder({
        files,
        folderName: filePath,
        location,
        directory,
      });
      await handleFolder({
        directoryPath: path,
        files,
        location: { x: location.x + 56, y: location.y },
        directory: newFolder.fileId,
      });
    } else {
      const content = await fs.readFile(path, { encoding: "utf8" });
      addTextFile({
        files,
        fileName: filePath,
        location: { x: location.x, y: location.y + 56 },
        directory,
        content,
      });
    }
  }
}

export async function getResumeFiles(): Promise<File[]> {
  const files: File[] = [];
  await handleFolder({
    directoryPath: BASE_DIR,
    location: { x: 4, y: 4 },
    directory: null,
    files,
  });
  return files;
}
