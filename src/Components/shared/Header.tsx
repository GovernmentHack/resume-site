import styled from "styled-components";
import React, { ElementType } from "react";
import { ToolbarContainer } from "./ToolbarContainer";
import { CloseIcon } from "./icons/CloseIcon";

const HeaderText = styled.div`
  font-weight: bold;
  flex: 0 0 auto;
  color: white;
  line-height: 12px;
  font-size: 12px;
`;
const Spacer = styled.div`
  flex: 1 0 auto;
`;

type HeaderProps = {
  onCloseClick: React.MouseEventHandler<any>;
  headerText: string;
  Icon: ElementType;
};

export const Header: React.FunctionComponent<HeaderProps> = ({
  onCloseClick,
  headerText,
  Icon,
}) => {
  return (
    <ToolbarContainer $header>
      <Icon />
      <HeaderText>{headerText}</HeaderText>
      <Spacer />
      <CloseIcon onClick={onCloseClick} />
    </ToolbarContainer>
  );
};

// getCloseClickHandler({ fileId, files, setFiles })
