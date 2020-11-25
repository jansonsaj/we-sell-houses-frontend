import React from 'react';

import {Menu} from 'antd';
import {HomeOutlined, SettingOutlined} from '@ant-design/icons';
import {Link, useLocation} from 'react-router-dom';
import {themes, useTheme, persistTheme, updateStyling} from '../ThemeContext';

const {SubMenu, Item, ItemGroup} = Menu;

/**
 * Navigation bar
 * @return {JSX.Element}
 */
function Navbar() {
  const {theme, setTheme} = useTheme();
  const location = useLocation();

  /**
   * Change the current theme and remember it
   * @param {string} theme Name of the theme
   */
  function changeTheme(theme) {
    setTheme(theme);
    persistTheme(theme);
    updateStyling(theme);
  }

  return (
    <Menu
      mode="horizontal"
      theme={theme}
      selectedKeys={[theme, location.pathname]}>
      <Item key="/" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Item>
      <SubMenu icon={<SettingOutlined />} title="Settings">
        <ItemGroup title="Theme">
          <Item
            key={themes.light}
            disabled={theme === themes.light}
            onClick={() => changeTheme(themes.light)}>
              Light
          </Item>
          <Item
            key={themes.dark}
            disabled={theme === themes.dark}
            onClick={() => changeTheme(themes.dark)}>
              Dark
          </Item>
        </ItemGroup>
      </SubMenu>
    </Menu>
  );
}

export default Navbar;
