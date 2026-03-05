import React, { createContext, useState } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

// Import your themes and global CSS from the new file!
import { lightTheme, darkTheme, GlobalStyles } from "./GlobalStyles";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Determine which object to pass to styled-components
  const activeTheme = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Pass the active theme to Styled-Components */}
      <StyledThemeProvider theme={activeTheme}>
        {/* Inject the global CSS variables */}
        <GlobalStyles />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};