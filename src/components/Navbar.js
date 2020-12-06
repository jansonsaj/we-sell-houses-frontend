import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import {Menu, message, Badge, notification} from 'antd';
import {
  HomeOutlined,
  SettingOutlined,
  MenuOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  MailOutlined,
} from '@ant-design/icons';
import {Link, useLocation, useHistory} from 'react-router-dom';
import {themes, useTheme, persistTheme, updateStyling} from '../ThemeContext';

const {SubMenu, Item, ItemGroup} = Menu;

/**
 * Navigation bar
 * @component
 * @param {object} props Component's properties
 * @return {JSX.Element}
 */
function Navbar(props) {
  const {theme, setTheme} = useTheme();
  const location = useLocation();
  const history = useHistory();
  const {signedIn} = props;
  const [unreadMessages, setUnreadMessages] = useState(null);

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

  useEffect(async () => {
    if (!signedIn) {
      return;
    }
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.getItem('accessToken'),
      },
    };

    const response = await fetch(
        `${process.env.REACT_APP_API_URL}/messages/summary`,
        options,
    );

    if (response.status === 200) {
      const summary = await response.json();
      if (unreadMessages !== null &&
        unreadMessages < summary.unreadMessageCount) {
        notification.info({
          message: 'New message',
          description:
              'You\'ve just received a new message. Click to go to messages.',
          onClick: () => {
            history.push('/messages');
          },
        });
      }
      setUnreadMessages(summary.unreadMessageCount);
    }
  }, [location.pathname]);

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
      {signedIn &&
        <Item key="/messages" icon={<MailOutlined />}>
          <Link to="/messages">
            Messages
            <Badge count={unreadMessages} size="small" offset={[2, -14]} />
          </Link>
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
  /** Update the value of "signedIn" */
  setSignedIn: PropTypes.func.isRequired,
  /** Whether the user is signed in or not */
  signedIn: PropTypes.bool.isRequired,
};

export default Navbar;
