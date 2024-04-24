import React from "react";
import Modal from "react-modal";
import { ContextMenuButton } from "../shared/ContextMenuButton";
import { ContextMenuDivider } from "../shared/ContextMenuDivider";
import { DisabledMenuItem } from "../shared/DisabledMenuItem";
import { getContextMenuModalStyle } from "../shared/handlers/getContextMenuModalStyle";
import { XYCoord } from "react-dnd";
import { NewMenuButton } from "./NewMenuButton";
import { DesktopFile } from "../../types";

type ContextMenuProps = {
  windowContextMenuIsOpen: boolean;
  windowContextMenuLocation: XYCoord;
  setWindowContextMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fileId: DesktopFile["directory"];
};

export const ContextMenu: React.FunctionComponent<ContextMenuProps> = ({
  windowContextMenuIsOpen,
  windowContextMenuLocation,
  setWindowContextMenuIsOpen,
  fileId,
}) => {
  return (
    <Modal
      isOpen={windowContextMenuIsOpen}
      onRequestClose={() => setWindowContextMenuIsOpen(false)}
      style={getContextMenuModalStyle(windowContextMenuLocation)}
    >
      <DisabledMenuItem>
        <div>
          <u>V</u>iew
        </div>
        <div>▶</div>
      </DisabledMenuItem>
      <DisabledMenuItem>
        <div>
          S<u>o</u>rt by
        </div>
        <div>▶</div>
      </DisabledMenuItem>
      <ContextMenuButton>
        <div>
          R<u>e</u>fresh
        </div>
      </ContextMenuButton>
      <ContextMenuDivider />
      <DisabledMenuItem>
        <div>
          <u>P</u>aste
        </div>
      </DisabledMenuItem>
      <DisabledMenuItem>
        <div>
          Paste <u>s</u>hortcut
        </div>
      </DisabledMenuItem>
      <ContextMenuDivider />
      <NewMenuButton
        fileId={fileId}
        windowContextMenuLocation={windowContextMenuLocation}
        setWindowContextMenuIsOpen={setWindowContextMenuIsOpen}
      />
      <ContextMenuDivider />
    </Modal>
  );
};
