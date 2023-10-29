import React from "react";
import styled from "styled-components";

const Bar = styled.div`
  background-color: silver;
  border-top: 1px solid #f4f4f4;
  border-bottom: 1px solid #4e4e4e;
  bottom: 0;
  box-shadow: inset 1px 0 #fff;
  display: block;
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
`;

const StartButtonIcon = styled.div`
  background-image: url(icons/start-button.png);
  background-repeat: no-repeat;
  height: 14px;
  width: 45px;
`;

const StartBar: React.FunctionComponent<{}> = () => {
  return (
    <Bar>
      <StartButton>
        <StartButtonIcon />
      </StartButton>
    </Bar>
  );
};

export default StartBar;
