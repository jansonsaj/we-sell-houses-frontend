import React from 'react';

import {Menu} from 'antd';
import {HomeOutlined, SettingOutlined} from '@ant-design/icons';
import {Link, useLocation} from 'react-router-dom';
import {themes, useTheme} from '../ThemeContext';

const {SubMenu, Item, ItemGroup} = Menu;

/**
 * Navigation bar
 * @return {JSX.Element}
 */
function Navbar() {
  const {theme, setTheme} = useTheme();
  const location = useLocation();
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
            onClick={() => setTheme(themes.light)}>
              Light
          </Item>
          <Item
            key={themes.dark}
            onClick={() => setTheme(themes.dark)}>
              Dark
          </Item>
        </ItemGroup>
      </SubMenu>
    </Menu>
  );
}

export default Navbar;
