const fs = require('fs');
const path = require('path');
const {
  override,
  addLessLoader,
  addWebpackPlugin,
} = require('customize-cra');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const {getLessVars} = require('antd-theme-generator');

/**
 * Extract the light and dark themes from Ant Design
 * and apply custom parameter overrides
 */
const lightTheme = {
  ...getLessVars('./node_modules/antd/lib/style/themes/default.less'),
  ...getLessVars('./src/styles/themes/LightTheme.less')};
const darkTheme = {
  ...getLessVars('./node_modules/antd/lib/style/themes/dark.less'),
  ...getLessVars('./src/styles/themes/DarkTheme.less')};

/**
 * Store the themes as JSON so that they can be loaded dynamically
 */
fs.writeFileSync('./src/styles/themes/light.json', JSON.stringify(lightTheme));
fs.writeFileSync('./src/styles/themes/dark.json', JSON.stringify(darkTheme));

/**
 * Override Webpack config
 */
module.exports = override(
    addWebpackPlugin(new AntDesignThemePlugin({
      stylesDir: path.join(__dirname, './src'),
      antDir: path.join(__dirname, './node_modules/antd'),
      varFile: path.join(__dirname, './src/styles/themes/LightTheme.less'),
      themeVariables: Array.from(new Set([
        ...Object.keys(darkTheme),
        ...Object.keys(lightTheme),
      ])),
      generateOnce: false, // generate color.less on each compilation
    })),
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
      },
    }),
);
