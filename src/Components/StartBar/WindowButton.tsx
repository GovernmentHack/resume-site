import React from "react";
import styled from "styled-components";
import { Folder, TextFile } from "../../types";
import { NotepadIcon } from "../shared/icons/NotepadIcon";
import { FolderExplorerIcon } from "../shared/icons/FolderExplorerIcon";
import { getWindowFocusClickHandler } from "../shared/handlers/windowFocusClickHandler";
import { getMinimizeClickHandler } from "../shared/handlers/minimizeClickHandler";
import { useFileStore } from "../../fileStore";

const WindowButtonContainer = styled.div<{
  $windowIsFocused?: boolean;
}>`
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
  ${(props) =>
    props.$windowIsFocused &&
    `border-left: 1px solid gray;
    border-top: 1px solid gray;
    border-bottom: 1px solid #fff;
    border-right: 1px solid #fff;
    background-color: white;
    box-shadow:
      inset -1px -1px #dfdfdf,
      -1px 0 #000,
      0 -1px #000,
      -1px -1px #000;
`}
  color: #000000;
  display: flex;
  justify-content: felx-start;
  align-items: center;
  column-gap: 2px;
  min-width: 45px;
  padding: 2px 2px 3px 2px;
  vertical-align: middle;
  height: 14px;
  width: 164px;
  flex: 0 1 auto;
`;

export const ButtonText = styled.span<{
  $windowIsFocused?: boolean;
}>`
  color: black;
  ${(props) =>
    props.$windowIsFocused &&
    `font-weight: bolder;
  `}
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
  file: TextFile | Folder;
}> = ({ file }) => {
  const { files, setFiles } = useFileStore();
  const focusWindow = getWindowFocusClickHandler({
    files,
    setFiles,
    fileId: file.fileId,
  });
  const toggleMinimize = getMinimizeClickHandler({
    files,
    setFiles,
    fileId: file.fileId,
  });
  return (
    <WindowButtonContainer
      $windowIsFocused={file.windowIsFocused}
      data-testid={`startbar-window-button-${file.fileId}`}
      onClick={file.windowIsFocused ? toggleMinimize : focusWindow}
    >
      {file.type === "folder" ? (
        <StartMenuFolderExplorerIcon />
      ) : (
        <StartMenuNotepadIcon />
      )}
      <ButtonText $windowIsFocused={file.windowIsFocused}>
        {file.fileName}
      </ButtonText>
    </WindowButtonContainer>
  );
};
