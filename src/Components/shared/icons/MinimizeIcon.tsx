import styled from "styled-components";

export const MinimizeIcon = styled.button`
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='6' height='1' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23000' d='M0 0h6v2H0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-color: silver;
  background-size: contain;
  background-position: bottom 3px left 1px;
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
