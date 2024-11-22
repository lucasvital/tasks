// src/styles/globalStyle.ts
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.color};
    font-family: Arial, sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${(props) => props.theme.primaryColor};
  }

  button {
    background-color: ${(props) => props.theme.primaryColor};
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

export default GlobalStyle;
