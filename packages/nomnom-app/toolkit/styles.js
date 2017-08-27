import { injectGlobal } from "styled-components";

export default injectGlobal`
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