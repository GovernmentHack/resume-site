import React, { createContext, useState } from "react";
import styled from "styled-components";
import StartBar from "./StartBar";
import Desktop from "./Desktop";
import Modal from "react-modal";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import { File } from "./utils/types";

const DesktopBackground = styled.div`
  background-color: teal;
  height: 100vh;
  width: 100vw;
  margin: -8px;
`;

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export const FileContext = createContext<{
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}>({ files: [], setFiles: () => {} });
Modal.setAppElement("head");

function App() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileContext.Provider value={{ files, setFiles }}>
      <DndProvider
        backend={isTouchDevice() ? TouchBackend : HTML5Backend}
        context={window}
      >
        <DesktopBackground>
          <Desktop />
          <StartBar />
        </DesktopBackground>
      </DndProvider>
    </FileContext.Provider>
  );
}

export default App;
