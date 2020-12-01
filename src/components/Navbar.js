import React from 'react';
import PropTypes from 'prop-types';

import {Menu, message} from 'antd';
import {
  HomeOutlined,
  SettingOutlined,
  MenuOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {Link, useLocation, useHistory} from 'react-router-dom';
import {themes, useTheme, persistTheme, updateStyling} from '../ThemeContext';

const {SubMenu, Item, ItemGroup} = Menu;

/**
 * Navigation bar
 * @param {object} props Component's properties
 * @return {JSX.Element}
 */
function Navbar(props) {
  const {theme, setTheme} = useTheme();
  const location = useLocation();
  const history = useHistory();
  const signedIn = !!localStorage.getItem('userId');

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
    localStorage.removeItem('userId');
    localStorage.removeItem('accessToken');
    props.setSignedIn(false);
    message.info('You have signed out');
    history.push('/signin');
  }

  return (
    <Menu
      mode="horizontal"
      theme={theme}
      selectedKeys={[location.pathname]}
      className="navbar"
      overflowedIndicator={<MenuOutlined className="collapsed-icon" />}>
      <Item key="/properties" icon={<HomeOutlined />}>
        <Link to="/properties">Properties</Link>
      </Item>
      {signedIn &&
        <Item key="/new-property" icon={<PlusCircleOutlined />}>
          <Link to="/new-property">New Property</Link>
        </Item>
      }
      {signedIn ?
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

Navbar.propTypes = {
  setSignedIn: PropTypes.func.isRequired,
  signedIn: PropTypes.bool.isRequired,
};

export default Navbar;
