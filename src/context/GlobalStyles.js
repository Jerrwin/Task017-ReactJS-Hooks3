import { createGlobalStyle } from "styled-components";

// 1. Export the Light Theme
export const lightTheme = {
  primary: "#0ea5e9",
  primaryDark: "#0284c7",
  primaryLight: "#e0f2fe",
  bgColor: "#f8fafc",
  cardBg: "#ffffff",
  textMain: "#0f172a",
  textMuted: "#64748b",
  border: "#e2e8f0"
};

// 2. Export the Dark Theme
export const darkTheme = {
  primary: "#38bdf8",
  primaryDark: "#7dd3fc",
  primaryLight: "#0f172a",
  bgColor: "#0f172a",
  cardBg: "#1e293b",
  textMain: "#f8fafc",
  textMuted: "#94a3b8",
  border: "#334155"
};

// 3. Export the Global Styles
export const GlobalStyles = createGlobalStyle`
  :root {
    --primary: ${(props) => props.theme.primary};
    --primary-dark: ${(props) => props.theme.primaryDark};
    --primary-light: ${(props) => props.theme.primaryLight};
    --bg-color: ${(props) => props.theme.bgColor};
    --card-bg: ${(props) => props.theme.cardBg};
    --text-main: ${(props) => props.theme.textMain};
    --text-muted: ${(props) => props.theme.textMuted};
    --border: ${(props) => props.theme.border};
  }

  body {
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.textMain};
    transition: all 0.2s ease;
  }
`;