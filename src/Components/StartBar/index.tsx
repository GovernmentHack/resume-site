import React from "react";
import styled from "styled-components";
import { WindowButton } from "./WindowButton";
import { ContextMenuVerticalDivider } from "../shared/ContextMenuVerticalDivider";
import { Folder, TextFile } from "../../types";
import { useFileStore } from "../../fileStore";

const Bar = styled.div`
  background-color: silver;
  border-top: 1px solid #f4f4f4;
  border-bottom: 1px solid #4e4e4e;
  bottom: 0;
  box-shadow: inset 1px 0 #fff;
  display: flex;
  justify-content: felx-start;
  align-items: stretch;
  column-gap: 6px;
  left: 0;
  padding: 2px;
  position: fixed;
  right: 0;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  z-index: 99999;
`;

const StartButton = styled.div`
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
  display: inline-block;
  float: left;
  margin-bottom: 2px;
  margin-left: 2px;
  margin-right: 6px;
  min-width: 45px;
  padding: 2px 6px 3px;
  vertical-align: middle;
  flex: 0 0 auto;
`;

const StartButtonIcon = styled.div`
  background-image: url(icons/start-button.png);
  background-repeat: no-repeat;
  height: 14px;
  width: 45px;
`;

const StartBar: React.FunctionComponent<{}> = () => {
  const { files } = useFileStore();
  const sortedOpenFiles = files
    .filter((file) => file.isOpen || file.isMinimized) // inherently casts type to TextFile | Folder, but TS isn't picking up on that
    .sort((fileA, fileB) => fileA.fileId.localeCompare(fileB.fileId)) as (
    | TextFile
    | Folder
  )[];
  return (
    <Bar>
      <StartButton>
        <StartButtonIcon />
      </StartButton>
      <ContextMenuVerticalDivider />
      {sortedOpenFiles.map((file) => (
        <WindowButton file={file} key={file.fileId} />
      ))}
    </Bar>
  );
};

export default StartBar;
