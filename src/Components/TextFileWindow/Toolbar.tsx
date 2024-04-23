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
        File
      </ToolbarText>
      <ToolbarTextDisabled>Edit</ToolbarTextDisabled>
      <ToolbarTextDisabled>Search</ToolbarTextDisabled>
      <ToolbarTextDisabled>Help</ToolbarTextDisabled>
    </ToolbarContainer>
  );
};
