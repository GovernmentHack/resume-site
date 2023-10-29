import styled from "styled-components";

export const ContextMenuButton = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding-right: 4px;
  padding-left: 16px;
  padding-bottom: 3px;
  padding-top: 1px;
  margin-right: 2px;
  margin-left: 2px;
  letter-spacing: -0.025em;
  text-rendering: optimizeLegibility;
  height: 16px;
  cursor: default;
  &:hover {
    background-color: navy;
    color: white;
  }
`;
