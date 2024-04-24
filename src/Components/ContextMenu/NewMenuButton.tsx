import React, { useContext } from "react";
import Modal from "react-modal";
import { ContextMenuButton } from "../shared/ContextMenuButton";
import { ContextMenuDivider } from "../shared/ContextMenuDivider";
import { NewFolderButtonIcon } from "../shared/icons/NewFolderButtonIcon";
import { NewTextDocumentIcon } from "../shared/icons/NewTextDocumentIcon";
import { FileContext } from "../../App";
import { getContextMenuModalStyle } from "../shared/handlers/getContextMenuModalStyle";
import { XYCoord } from "react-dnd";
import { DesktopFile } from "../../types";
import { getNewButtonClickHandler } from "./getNewButtonClickHandler";
import { FILE_TYPE } from "../shared/constants";

type NewButtonProps = {
  windowContextMenuLocation: XYCoord;
  fileId: DesktopFile["directory"];
  setWindowContextMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NewMenuButton: React.FunctionComponent<NewButtonProps> = ({
  windowContextMenuLocation,
  setWindowContextMenuIsOpen,
  fileId,
}) => {
  const { files, setFiles } = useContext(FileContext);
  const [windowNewMenuIsOpen, setWindowNewMenuIsOpen] = React.useState(false);
  return (
    <ContextMenuButton
      data-testid="context_menu_new_button"
      onMouseEnter={() => setWindowNewMenuIsOpen(true)}
      onMouseLeave={() => setWindowNewMenuIsOpen(false)}
      style={{
        backgroundColor: windowNewMenuIsOpen ? "navy" : undefined,
        color: windowNewMenuIsOpen ? "white" : undefined,
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <div>
        Ne<u>w</u>
      </div>
      <div>▶</div>
      <Modal
        isOpen={windowNewMenuIsOpen}
        onRequestClose={() => setWindowNewMenuIsOpen(false)}
        style={getContextMenuModalStyle({
          x: windowContextMenuLocation.x + 164,
          y: windowContextMenuLocation.y + 118,
        })}
      >
        <ContextMenuButton
          data-testid="context_menu_new_folder_button"
          style={{
            justifyContent: "flex-start",
            paddingLeft: "2px",
          }}
          onClick={getNewButtonClickHandler({
            setFiles,
            files,
            location: windowContextMenuLocation,
            closeModals: () => {
              setWindowNewMenuIsOpen(false);
              setWindowContextMenuIsOpen(false);
            },
            directory: fileId,
            type: FILE_TYPE.folder,
          })}
        >
          <NewFolderButtonIcon />
          <div>
            <u>F</u>older
          </div>
        </ContextMenuButton>
        <ContextMenuDivider />
        <ContextMenuButton
          data-testid="context_menu_new_textfile_button"
          style={{
            justifyContent: "flex-start",
            paddingLeft: "2px",
          }}
          onClick={getNewButtonClickHandler({
            setFiles,
            files,
            location: windowContextMenuLocation,
            closeModals: () => {
              setWindowNewMenuIsOpen(false);
              setWindowContextMenuIsOpen(false);
            },
            directory: fileId,
            type: FILE_TYPE.textFile,
          })}
        >
          <NewTextDocumentIcon />
          <div>Text Document</div>
        </ContextMenuButton>
      </Modal>
    </ContextMenuButton>
  );
};
