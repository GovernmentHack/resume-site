import React, { useContext, useState } from "react";
import { FileContext } from "../../App";
import { FileDragItem, TextFile } from "../../utils/types";
import { DragSourceMonitor, useDrag } from "react-dnd";
import {
  DragTypes,
  disableDragging,
} from "../../utils/constants";
import { getContextMenuModalStyle } from "../../utils/getContextMenuModalStyle";
import Modal from "react-modal";
import { ContextMenuButton } from "../shared/ContextMenuButton";
import { ContextMenuDivider } from "../shared/ContextMenuDivider";
import { DisabledMenuItem } from "../shared/DisabledMenuItem";
import { getWindowFocusClickHandler } from "../../utils/windowFocusClickHandler";
import { WindowContainer } from "../shared/WindowContainer";
import { Toolbar } from "./Toolbar";
import { TextBox } from "./TextBox";
import { getCloseClickHandler } from "./getCloseClickHandler";
import { getSaveFileClickHandler } from "./getSaveFileClickHandler";
import { Header } from "../shared/Header";
import { NotepadIcon } from "../shared/icons/NotepadIcon";

type TextFileWindowProps = TextFile;

function getModalStyle(location: { x: number; y: number }): Modal.Styles {
  return getContextMenuModalStyle(location);
}

const TextFileDesktopWindow: React.FunctionComponent<TextFileWindowProps> = ({
  fileId,
  fileName,
  windowLocation,
  windowIsFocused,
  content,
  isEditable,
}) => {
  const { files, setFiles } = useContext(FileContext);
  const [fileMenuIsOpen, setFileMenuIsOpen] = useState(false);
  const [tempTextContent, setTempTextContent] = useState(content);
  const [{ isDragging }, drag] = useDrag<
    FileDragItem,
    unknown,
    { isDragging: boolean }
  >(() => ({
    type: DragTypes.window,
    collect: (monitor: DragSourceMonitor<unknown, unknown>) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
    options: {
      dropEffect: "move",
    },
    item: {
      fileId,
      type: DragTypes.window,
    },
  }));

  return (
    <WindowContainer
      data-testid={`${fileId}_textfile_window_container`}
      ref={drag}
      style={{
        left: windowLocation.x,
        top: windowLocation.y,
        opacity: isDragging ? 0 : 1,
        zIndex: windowIsFocused ? 1 : 0,
        position: "absolute",
      }}
      onDragStart={getWindowFocusClickHandler({ files, fileId, setFiles })}
      onClick={(event) => {
        setFileMenuIsOpen(false);
        getWindowFocusClickHandler({ files, fileId, setFiles })();
        event.stopPropagation();
      }}
    >
      <Header
        headerText={`${fileName} - Notepad`}
        Icon={NotepadIcon}
        onCloseClick={getCloseClickHandler({ fileId, files, setFiles })}
      />
      <Toolbar
        onFileClick={(event) => {
          setFileMenuIsOpen(true);
          event.stopPropagation();
        }}
        fileMenuIsOpen={fileMenuIsOpen}
      />
      <TextBox
        {...disableDragging}
        value={tempTextContent}
        onChange={(event) => {
          setTempTextContent(event.target.value);
        }}
        readOnly={!isEditable}
      />
      <Modal
        isOpen={fileMenuIsOpen}
        onRequestClose={() => setFileMenuIsOpen(false)}
        style={getModalStyle({
          x: windowLocation.x + 8,
          y: windowLocation.y + 52,
        })}
      >
        <DisabledMenuItem>
          <div>
            <u>N</u>ew
          </div>
          <div>Ctrl+N</div>
        </DisabledMenuItem>
        <DisabledMenuItem>
          <div>
            <u>O</u>pen
          </div>
          <div>Ctrl+O</div>
        </DisabledMenuItem>
        <ContextMenuButton
          onClick={getSaveFileClickHandler({
            fileId,
            files,
            setFiles,
            newContent: tempTextContent,
            closeMenu: () => setFileMenuIsOpen(false),
          })}
        >
          <div>
            <u>S</u>ave
          </div>
          <div>Ctrl+S</div>
        </ContextMenuButton>
        <DisabledMenuItem>
          <div>
            Save <u>A</u>s
          </div>
          <div>Ctrl+Shift+S</div>
        </DisabledMenuItem>
        <ContextMenuDivider />
        <ContextMenuButton
          onClick={getCloseClickHandler({ fileId, files, setFiles })}
        >
          <div>
            E<u>x</u>it
          </div>
        </ContextMenuButton>
      </Modal>
    </WindowContainer>
  );
};

export default TextFileDesktopWindow;
