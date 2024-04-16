import React from "react";
import { disableDragging } from "../../utils/constants";
import { ToolbarTextDisabled } from "../shared/ToolbarTextDisabled";
import { ToolbarContainer } from "../shared/ToolbarContainer";
import { ContextMenuVerticalDivider } from "../ContextMenu/ContextMenuVerticalDivider";

export const Toolbar: React.FunctionComponent = () => {
  return (
    <ToolbarContainer {...disableDragging}>
      <ContextMenuVerticalDivider />
      <ToolbarTextDisabled>
        <div>
          <u>F</u>ile
        </div>
      </ToolbarTextDisabled>
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
