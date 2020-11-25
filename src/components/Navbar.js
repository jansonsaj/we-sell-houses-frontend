import React from 'react';

import {Menu} from 'antd';
import {
  HomeOutlined, SettingOutlined, MenuOutlined, LoginOutlined, LogoutOutlined,
} from '@ant-design/icons';
import {Link, useLocation, useHistory} from 'react-router-dom';
import {themes, useTheme, persistTheme, updateStyling} from '../ThemeContext';

const {SubMenu, Item, ItemGroup} = Menu;

/**
 * Navigation bar
 * @return {JSX.Element}
 */
function Navbar() {
  const {theme, setTheme} = useTheme();
  const location = useLocation();
  const history = useHistory();
  const user = localStorage.getItem('user');

  /**
   * Change the current theme and remember it
   * @param {string} theme Name of the theme
   */
  function changeTheme(theme) {
    setTheme(theme);
    persistTheme(theme);
    updateStyling(theme);
  }

  /**
   * Sign out the user and redirect to sign in page
   */
  function signOut() {
    localStorage.removeItem('user');
    history.push('/signin?message=You have signed out');
  }

  return (
    <Menu
      mode="horizontal"
      theme={theme}
      selectedKeys={[location.pathname]}
      className="navbar"
      overflowedIndicator={<MenuOutlined className="collapsed-icon" />}>
      <Item key="/" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Item>
      {user ?
      <Item
        key="/signout"
        icon={<LogoutOutlined />}
        className="navbar-right"
        onClick={signOut}>
        Sign Out
      </Item> :
      <Item key="/signin" icon={<LoginOutlined />} className="navbar-right">
        <Link to="/signin">Sign In</Link>
      </Item>
      }
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
