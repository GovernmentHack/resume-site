import React, { createContext, useEffect, useState } from "react";
import styled from "styled-components";
import StartBar from "./Components/StartBar";
import Desktop from "./Components/Desktop";
import Modal from "react-modal";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import { DesktopFile, Shortcut } from "./types";
import { FILE_TYPE, FILE_ICON } from "./utils/constants";
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

// Cursor styling from http://www.rw-designer.com/cursor-detail/151730

export const FileContext = createContext<{
  files: DesktopFile[];
  setFiles: React.Dispatch<React.SetStateAction<DesktopFile[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>({ files: [], setFiles: () => {}, loading: false, setLoading: () => {} });
Modal.setAppElement("head");

const App: React.FunctionComponent = () => {
  const [files, setFiles] = useState<DesktopFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setFiles([...files, getResumeShortcut()]);
  }, []);

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
