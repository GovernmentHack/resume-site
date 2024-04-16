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
        hoverStyling
        onClick={onFileClick}
        style={
          fileMenuIsOpen
            ? {
                borderRight: "2px solid #dfdfdf",
                borderBottom: "2px solid #dfdfdf",
                borderLeft: "2px solid #7f7f7f",
                borderTop: "2px solid #7f7f7f",
              }
            : {}
        }
      >
        File
      </ToolbarText>
      <ToolbarTextDisabled>Edit</ToolbarTextDisabled>
      <ToolbarTextDisabled>Search</ToolbarTextDisabled>
      <ToolbarTextDisabled>Help</ToolbarTextDisabled>
    </ToolbarContainer>
  );
};
