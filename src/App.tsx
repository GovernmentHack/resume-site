import React, { createContext, useEffect, useState } from "react";
import styled from "styled-components";
import StartBar from "./Components/StartBar";
import Desktop from "./Components/Desktop";
import Modal from "react-modal";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import { File, Shortcut } from "./utils/types";
import { FileTypes, FileIcon } from "./utils/constants";
import { v4 as uuidv4 } from "uuid";
import { getResumeFiles } from "./utils/resumeFileGenerator";

const DesktopBackground = styled.div`
  background-color: teal;
  height: 100vh;
  width: 100vw;
  margin: -8px;
`;

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

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
    }: {
      files: File[];
      setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    }) => {
      // Remove the shortcut now so as to not allow accidental double clicking
      const allOtherFiles = files.filter((file) => file.fileId !== selfId);
      setFiles([...allOtherFiles]);
      setTimeout(async () => {
        const resumeFiles = await getResumeFiles();
        setFiles([...allOtherFiles, ...resumeFiles]);
      }, 0);
    },
    isEditable: false,
    type: FileTypes.shortcut,
    icon: FileIcon.executable,
    directory: null,
  } as Shortcut;
};

export const FileContext = createContext<{
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}>({ files: [], setFiles: () => {} });
Modal.setAppElement("head");

const App: React.FunctionComponent = () => {
  const [files, setFiles] = useState<File[]>([]);
  useEffect(() => {
    setFiles([...files, getResumeShortcut()]);
  }, []);

  return (
    <FileContext.Provider value={{ files, setFiles }}>
      <DndProvider
        backend={isTouchDevice() ? TouchBackend : HTML5Backend}
        context={window}
        options={{ enableMouseEvents: true }}
      >
        <DesktopBackground>
          <Desktop />
          <StartBar />
        </DesktopBackground>
      </DndProvider>
    </FileContext.Provider>
  );
};

export default App;
