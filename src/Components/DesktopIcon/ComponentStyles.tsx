import styled from "styled-components";

export const IconContainer = styled.div`
  height: 48px;
  position: absolute;
  width: 70px;
  z-index: 0;
`;
export const IconImage = styled.div`
  background-repeat: no-repeat;
  height: 32px;
  margin-bottom: 4px;
  margin-left: auto;
  margin-right: auto;
  width: 32px;
`;
export const IconText = styled.span`
  color: white;
  display: block;
  font-family: px_sans_nouveaux;
  font-size: 8px;
  letter-spacing: -0.025em;
  line-height: 12px;
  text-align: center;
  text-rendering: optimizeLegibility;
  text-overflow: ellipsis;
  white-space: wrap;
  overflow: hidden;
`;
export const IconTextEditable = styled.input`
  width: 70px;
  height: 14px;
  background-color: rgba(1, 1, 122, 0.5);
  outline: none;
  border: none;
  color: white;
  display: block;
  font-family: px_sans_nouveaux;
  font-size: 8px;
  letter-spacing: -0.025em;
  line-height: 12px;
  text-align: center;
  text-rendering: optimizeLegibility;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='white' stroke-width='3' stroke-dasharray='1%2c 2' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
`;
