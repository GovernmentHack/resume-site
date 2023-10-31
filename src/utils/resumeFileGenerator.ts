import { File, Folder, TextFile } from "../utils/types";
import { v4 as uuidv4 } from "uuid";
import { DragTypes, FileIcon } from "./constants";
import { XYCoord } from "react-dnd";
import axios from "axios";

const BASE_DIR = "src/resume";
const API_BASE_URL =
  "https://api.github.com/repos/GovernmentHack/resume-site/contents/";

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
        location,
        directory,
      });
      await handleFolder({
        directoryPath: file.path,
        files,
        location: { x: location.x + locationAdjustment, y: location.y },
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
        location: { x: location.x, y: location.y + locationAdjustment },
        directory,
        content,
      });
    }
    locationAdjustment += 56;
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
