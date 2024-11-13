import { create } from "zustand";
import { DesktopFile, FileStoreState, Shortcut, TextFile } from "./types";
import { getResumeFiles } from "./Components/resumeFileGenerator";
import { FILE_ICON, FILE_TYPE } from "./Components/shared/constants";
import { v4 as uuidv4 } from "uuid";

const getIntroduction = (): TextFile => {
  return {
    fileId: uuidv4(),
    icon: FILE_ICON.textFile,
    fileName: "READ ME",
    type: FILE_TYPE.textFile,
    location: { x: 184, y: 4 },
    windowLocation: { x: 64, y: 64 },
    windowIsFocused: false,
    isHighlighted: false,
    textIsEditing: false,
    isOpen: false,
    isMinimized: false,
    isEditable: false,
    content: `Welcome to my resume site! This is just a fun project I've been working on to showcase my professional experience. Its obviously missing most of what a Windows 98 desktop would have, but it does simulate the basics Windows 98 had with its draggable icons and windows. Please feel free to play around and explore!
      
And when you get bored, or are looking to actually see my resume, click the "Populate Grant's Resume" on the desktop. This will import my resume as explorable files and folders from my GitHub.
      
Enjoy!`,
    directory: null,
  };
};

const getResumeShortcut = (): Shortcut => {
  const selfId = uuidv4();
  return {
    fileName: "Populate Grant's Resume",
    fileId: selfId,
    location: { x: 4, y: 4 },
    windowLocation: null,
    isHighlighted: false,
    textIsEditing: false,
    isOpen: null,
    content: ({
      files,
      setFiles,
      setLoading,
    }: {
      files: DesktopFile[];
      setFiles: React.Dispatch<React.SetStateAction<DesktopFile[]>>;
      setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    }) => {
      // Remove the shortcut now so as to not allow accidental double clicking
      const allOtherFiles = files.filter((file) => file.fileId !== selfId);
      setFiles([...allOtherFiles]);
      setTimeout(async () => {
        setLoading(true);
        const resumeFiles = await getResumeFiles();
        setFiles([...allOtherFiles, ...resumeFiles]);
        setLoading(false);
      }, 0);
    },
    isEditable: false,
    type: FILE_TYPE.shortcut,
    icon: FILE_ICON.executable,
    directory: null,
  } as Shortcut;
};

const getLinkedInShortcut = (): Shortcut => {
  return {
    fileName: "Grant's Linkedin Profile",
    fileId: uuidv4(),
    location: { x: 64, y: 4 },
    windowLocation: null,
    isHighlighted: false,
    textIsEditing: false,
    isOpen: null,
    content: ({ files: _, setFiles: __, setLoading: ___ }) => {
      // open the Linkedin Url in another window
      window
        .open("https://www.linkedin.com/in/grant-apodaca/", "_blank")
        ?.focus();
    },
    isEditable: false,
    type: FILE_TYPE.shortcut,
    icon: FILE_ICON.internetPage,
    directory: null,
  } as Shortcut;
};

const getGitHubShortcut = (): Shortcut => {
  return {
    fileName: "This site's GitHub",
    fileId: uuidv4(),
    location: { x: 124, y: 4 },
    windowLocation: null,
    isHighlighted: false,
    textIsEditing: false,
    isOpen: null,
    content: ({ files: _, setFiles: __, setLoading: ___ }) => {
      // open the Linkedin Url in another window
      window
        .open("https://github.com/GovernmentHack/resume-site", "_blank")
        ?.focus();
    },
    isEditable: false,
    type: FILE_TYPE.shortcut,
    icon: FILE_ICON.internetPage,
    directory: null,
  } as Shortcut;
};

export const useFileStore = create<FileStoreState>((set) => ({
  files: [
    getResumeShortcut(),
    getLinkedInShortcut(),
    getGitHubShortcut(),
    getIntroduction(),
  ],
  loading: false,
  setFiles: (files: DesktopFile[]) => {
    set({ files });
  },
  setLoading: (loading) => {
    set({ loading });
  },
}));
