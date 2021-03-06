import React from 'react';
import PropTypes from 'prop-types';

import darkVars from './styles/themes/dark.json';
import lightVars from './styles/themes/light.json';

const THEME_KEY = 'theme';

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
 * @component
 * @param {object} children Children to pass Context to
 * @return {JSX.Element}
 */
function ThemeProvider({children}) {
  const defaultTheme = localStorage.getItem(THEME_KEY) || themes.light;
  updateStyling(defaultTheme);
  const [theme, setTheme] = React.useState(defaultTheme);
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

/**
 * Persist the specifiec theme in Local Storage
 * @param {string} theme Name of the theme
 */
function persistTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Updates the whole page's style variables
 * @param {string} theme Name of the theme
 */
function updateStyling(theme) {
  const vars = theme === themes.light ? lightVars : darkVars;
  window.less.modifyVars(vars).catch(console.error);
}

export {themes, ThemeProvider, useTheme, persistTheme, updateStyling};
