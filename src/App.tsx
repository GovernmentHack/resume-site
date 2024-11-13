import React from "react";
import styled from "styled-components";
import StartBar from "./Components/StartBar";
import Desktop from "./Components/Desktop";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import { useFileStore } from "./fileStore";

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

// Cursor styling from http://www.rw-designer.com/cursor-detail/151730

const App: React.FunctionComponent = () => {
  const { loading } = useFileStore();
  return (
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
  );
};

export default App;
