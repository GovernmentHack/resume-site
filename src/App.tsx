import React, { createContext, useState } from "react";
import styled from "styled-components";
import StartBar from "./Components/StartBar";
import Desktop from "./Components/Desktop";
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

const App: React.FunctionComponent<{ initialFiles: File[] }> = ({
  initialFiles,
}) => {
  const [files, setFiles] = useState<File[]>(initialFiles);
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
