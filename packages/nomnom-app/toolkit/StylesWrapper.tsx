import React from "react";
import { css, Global } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";

import defaultTheme from "./theme";

const baseStyles = css`
  html,
  body {
    margin: 0;
    padding: 0;
    font-family: Roboto, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  .icon {
    color: inherit;
    display: inline-block;
    fill: currentcolor;
    height: 24px;
    width: 24px;
    user-select: none;
  }
`;

const StylesWrapper = ({ children, theme = defaultTheme }) => (
  <ThemeProvider theme={theme}>
    <Global styles={[baseStyles]} />
    {children}
  </ThemeProvider>
);

export default StylesWrapper;
