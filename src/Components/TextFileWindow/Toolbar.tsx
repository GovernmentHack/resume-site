import React from "react";
import { disableDragging } from "../../utils/constants";
import { ToolbarContainer } from "../shared/ToolbarContainer";
import { ToolbarText } from "../shared/ToolbarText";
import { ToolbarTextDisabled } from "../shared/ToolbarTextDisabled";

type ToolbarProps = {
  onFileClick: React.MouseEventHandler<HTMLDivElement>;
  fileMenuIsOpen: boolean;
};

export const Toolbar: React.FunctionComponent<ToolbarProps> = ({
  onFileClick,
  fileMenuIsOpen,
}) => {
  return (
    <ToolbarContainer {...disableDragging}>
      <ToolbarText
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
          <u>S</u>earch
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
