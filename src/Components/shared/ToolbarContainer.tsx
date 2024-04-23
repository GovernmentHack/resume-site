import styled from "styled-components";

export const ToolbarContainer = styled.div<{ $header?: boolean }>`
  background-color: ${(props) => (Boolean(props.$header) ? "navy" : "silver")};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: 28px;
  align-items: center;
  flex: 0 0 auto;
  overflow: hidden;
  padding-left: 2px;
`;
