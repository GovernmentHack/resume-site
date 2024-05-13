import React, { createContext, useState } from "react";
import styled from "styled-components";
import StartBar from "./Components/StartBar";
import Desktop from "./Components/Desktop";
import Modal from "react-modal";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import { DesktopFile, Shortcut, TextFile } from "./types";
import { FILE_TYPE, FILE_ICON } from "./Components/shared/constants";
import { v4 as uuidv4 } from "uuid";
import { getResumeFiles } from "./Components/resumeFileGenerator";

const DesktopBackground = styled.div`
  background-color: teal;
  height: 100vh;
  width: 100vw;
  margin: -8px;
  overflow: hidden;
`;

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

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

// Cursor styling from http://www.rw-designer.com/cursor-detail/151730

export const FileContext = createContext<{
  files: DesktopFile[];
  setFiles: React.Dispatch<React.SetStateAction<DesktopFile[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>({ files: [], setFiles: () => {}, loading: false, setLoading: () => {} });
Modal.setAppElement("head");

const App: React.FunctionComponent = () => {
  const [files, setFiles] = useState<DesktopFile[]>([
    getResumeShortcut(),
    getLinkedInShortcut(),
    getGitHubShortcut(),
    getIntroduction(),
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <FileContext.Provider value={{ files, setFiles, loading, setLoading }}>
      <DndProvider
        backend={isTouchDevice() ? TouchBackend : HTML5Backend}
        context={window}
        options={{ enableMouseEvents: true }}
      >
        <DesktopBackground
          style={loading ? { cursor: "url(icons/loading.cur), auto" } : {}}
        >
          <Desktop />
          <StartBar />
        </DesktopBackground>
      </DndProvider>
    </FileContext.Provider>
  );
};

export default App;
