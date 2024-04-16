import styled from "styled-components";

export const CloseIcon = styled.button`
  background-image: url(icons/close-icon.png);
  background-repeat: no-repeat;
  background-color: silver;
  background-size: contain;
  border-left: 2px solid #ededed;
  border-top: 2px solid #ededed;
  border-right: 2px solid #404040;
  border-bottom: 2px solid #404040;
  height: 2px;
  width: 2px;
  flex: 0 0 auto;
  margin: 2px;
  padding: 6px;
  &:active {
    border-right: 2px solid #ededed;
    border-bottom: 2px solid #ededed;
    border-left: 2px solid #404040;
    border-top: 2px solid #404040;
  }
`;
