import React from 'react';
import PropTypes from 'prop-types';

const themes = {
  light: 'light',
  dark: 'dark',
};

const ThemeContext = React.createContext({
  theme: themes.light,
  setTheme: () => {},
});

/**
 * Creates a ThemeContext.Provider wrapper
 * @param {object} children Children to pass Context to
 * @return {JSX.Element}
 */
function ThemeProvider({children}) {
  const [theme, setTheme] = React.useState(themes.light);
  const value = {theme, setTheme};

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

/**
 * Use theme context
 * @param {string} theme Name of the theme
 * @return {object} Contains "theme" and "setTheme" from ThemeContext
 */
function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('setTheme must be used within a ThemeProvider');
  }
  return context;
}

export {themes, ThemeProvider, useTheme};
