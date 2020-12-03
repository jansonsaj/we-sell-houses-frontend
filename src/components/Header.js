import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Header.less';
import {Layout} from 'antd';
import Navbar from './Navbar';
import {useTheme} from '../ThemeContext';
import {Link} from 'react-router-dom';

/**
 * Header component
 * @component
 * @param {object} props Component's properties
 * @return {JSX.Element}
 */
function Header(props) {
  const {theme} = useTheme();
  return (
    <Layout.Header className={`header ${theme}`}>
      <Link to="/"><h2 className="logo">We Sell Houses</h2></Link>
      <Navbar setSignedIn={props.setSignedIn} signedIn={props.signedIn} />
    </Layout.Header>
  );
}

Header.propTypes = {
  /** Update the value of "signedIn" */
  setSignedIn: PropTypes.func.isRequired,
  /** Whether the user is signed in or not */
  signedIn: PropTypes.bool.isRequired,
};

export default Header;
