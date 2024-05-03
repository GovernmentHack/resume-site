import React from "react";
import styled from "styled-components";
import { DesktopFile } from "../../types";
import { NotepadIcon } from "../shared/icons/NotepadIcon";
import { FolderExplorerIcon } from "../shared/icons/FolderExplorerIcon";

const WindowButtonContainer = styled.div`
  background-color: silver;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  border-right: 1px solid gray;
  border-bottom: 1px solid gray;
  box-shadow:
    inset 1px 1px #dfdfdf,
    1px 0 #000,
    0 1px #000,
    1px 1px #000;
  color: #000000;
  display: flex;
  justify-content: felx-start;
  align-items: center;
  row-gap: 2px;
  margin-bottom: 2px;
  margin-left: 2px;
  margin-right: 6px;
  min-width: 45px;
  padding: 2px 6px 3px;
  vertical-align: middle;
  height: 14px;
  width: 164px;
  flex: 0 1 auto;
`;

export const ButtonText = styled.span`
  color: black;
  font-family: px_sans_nouveaux;
  font-size: 8px;
  letter-spacing: -0.025em;
  line-height: 12px;
  text-align: center;
  text-rendering: optimizeLegibility;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  flex: 0 1 auto;
  min-width: 0;
`;

export const StartMenuNotepadIcon = styled(NotepadIcon)`
  height: 14px;
  width: 14px;
`;

export const StartMenuFolderExplorerIcon = styled(FolderExplorerIcon)`
  height: 14px;
  width: 14px;
`;

export const WindowButton: React.FunctionComponent<{
  file: DesktopFile;
}> = ({ file }) => {
  return (
    <WindowButtonContainer>
      {file.type === "folder" ? (
        <StartMenuFolderExplorerIcon />
      ) : (
        <StartMenuNotepadIcon />
      )}
      <ButtonText>{file.fileName}</ButtonText>
    </WindowButtonContainer>
  );
};
