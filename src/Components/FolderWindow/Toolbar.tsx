import React from "react";
import { disableDragging } from "../../utils/constants";
import { ToolbarTextDisabled } from "../shared/ToolbarTextDisabled";
import { ToolbarContainer } from "../shared/ToolbarContainer";
import { ContextMenuVerticalDivider } from "../shared/ContextMenuVerticalDivider";
import { ToolbarText } from "../shared/ToolbarText";

export const Toolbar: React.FunctionComponent<{
  onFileClick: React.MouseEventHandler<HTMLDivElement>;
  fileMenuIsOpen: boolean;
}> = ({ onFileClick, fileMenuIsOpen }) => {
  return (
    <ToolbarContainer {...disableDragging}>
      <ContextMenuVerticalDivider />
      <ToolbarText
        data-testid={"folder_window_file_toolbar_button"}
        $hoverStyling
        $fileMenuIsOpen={fileMenuIsOpen}
        onClick={onFileClick}
      >
        <div>
          <u>F</u>ile
        </div>
      </ToolbarText>
      <ToolbarTextDisabled>
        <div>
          <u>E</u>dit
        </div>
      </ToolbarTextDisabled>
      <ToolbarTextDisabled>
        <div>
          <u>V</u>iew
        </div>
      </ToolbarTextDisabled>
      <ToolbarTextDisabled>
        <div>
          <u>G</u>o
        </div>
      </ToolbarTextDisabled>
      <ToolbarTextDisabled>
        <div>
          F<u>a</u>vorites
        </div>
      </ToolbarTextDisabled>
      <ToolbarTextDisabled>
        <div>
          <u>T</u>ools
        </div>
      </ToolbarTextDisabled>
      <ToolbarTextDisabled>
        <div>
          <u>H</u>elp
        </div>
      </ToolbarTextDisabled>
    </ToolbarContainer>
  );
};
