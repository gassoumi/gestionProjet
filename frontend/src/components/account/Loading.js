import React from 'react';
import {css} from "@emotion/core";
import MoonLoader from "react-spinners/MoonLoader";

const override = css`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  border-color: red;
`;

function Loading(props) {
    return (
        <MoonLoader
            css={override}
            size={60}
            color={"#123abc"}
            loading={true}
        />
    );
}

export default Loading;