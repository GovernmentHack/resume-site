import styled from "styled-components";

export const ToolbarButton = styled.div`
  flex: 0 0 auto;
  color: black;
  line-height: 20px;
  font-size: 12px;
  text-align: center;
  padding-left: 8px;
  padding-right: 8px;
  height: 20px;
  border: 2px solid transparent;
  &:hover {
    border-right: 2px solid #dfdfdf;
    border-bottom: 2px solid #dfdfdf;
    border-left: 2px solid #7f7f7f;
    border-top: 2px solid #7f7f7f;
  }
`;
