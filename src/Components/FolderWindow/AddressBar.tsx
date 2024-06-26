import React from "react";
import { disableDragging } from "../shared/constants";
import { ContextMenuVerticalDivider } from "../shared/ContextMenuVerticalDivider";
import { FolderExplorerIcon } from "../shared/icons/FolderExplorerIcon";
import { ToolbarContainer } from "../shared/ToolbarContainer";
import { ToolbarText } from "../shared/ToolbarText";
import { AddressBarContainer } from "./AddressBarContainer";

export const AddressBar: React.FunctionComponent<{ fileName: string }> = ({
  fileName,
}) => {
  return (
    <ToolbarContainer {...disableDragging}>
      <ContextMenuVerticalDivider />
      <ToolbarText>Address</ToolbarText>
      <AddressBarContainer>
        <FolderExplorerIcon />
        <div>{`${fileName}`}</div>
      </AddressBarContainer>
    </ToolbarContainer>
  );
};
