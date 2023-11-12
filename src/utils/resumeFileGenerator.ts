import { File, Folder, TextFile } from "../utils/types";
import { v4 as uuidv4 } from "uuid";
import { DragTypes, FileIcon } from "./constants";
import { XYCoord } from "react-dnd";
import axios from "axios";
import { generateNewWindowLocation } from "./generateNewWindowLocation";

const BASE_DIR = "src/resume";
const API_BASE_URL =
  "https://api.github.com/repos/GovernmentHack/resume-site/contents/";
const OFFSET = 64;

type GithubFileDescriptor = {
  name: string;
  path: string;
  download_url: string;
  type: "file";
};

type GithubDirectoryDescriptor = {
  name: string;
  path: string;
  download_url: null;
  type: "dir";
};

type GithubContentApiResult = (
  | GithubFileDescriptor
  | GithubDirectoryDescriptor
)[];

async function getGithubDirectoryContents(
  path: string,
): Promise<GithubContentApiResult | null> {
  try {
    const result = await axios.get<GithubContentApiResult>(
      `${API_BASE_URL}/${path}`,
    );
    if (result?.data?.length) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error("Unable to fetch resume directory contents from Github :(");
    return null;
  }
}

async function getGithubRawFile(donloadUrl: string): Promise<string | null> {
  try {
    const result = await axios.get<string>(donloadUrl);
    if (result?.data?.length) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error("Unable to fetch resume file from Github :(");
    return null;
  }
}

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
    windowIsFocused: false,
    isHighlighted: false,
    textIsEditing: false,
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
    windowLocation: generateNewWindowLocation(files),
    windowIsFocused: false,
    isHighlighted: false,
    textIsEditing: false,
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
  const rootDirFiles = await getGithubDirectoryContents(directoryPath);
  if (!rootDirFiles) {
    return;
  }
  let locationAdjustment = location.x;
  for (const file of rootDirFiles) {
    if (file.type === "dir") {
      const newFolder = addFolder({
        files,
        folderName: file.name,
        location: {
          x: location.x + locationAdjustment + OFFSET,
          y: location.y,
        },
        directory,
      });
      await handleFolder({
        directoryPath: file.path,
        files,
        location: { x: location.x, y: location.y },
        directory: newFolder.fileId,
      });
    } else {
      const content = await getGithubRawFile(file.download_url);
      if (!content) {
        return;
      }
      addTextFile({
        files,
        fileName: file.name,
        location: {
          x: location.x + locationAdjustment,
          y: location.y + locationAdjustment,
        },
        directory,
        content,
      });
    }
    locationAdjustment += OFFSET;
  }
}

export async function getResumeFiles(): Promise<File[]> {
  const files: File[] = [];
  await handleFolder({
    directoryPath: BASE_DIR,
    location: { x: 8, y: 88 },
    directory: null,
    files,
  });
  return files;
}
