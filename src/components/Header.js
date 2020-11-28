import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Header.less';
import {Layout} from 'antd';
import Navbar from './Navbar';
import {useTheme} from '../ThemeContext';
import {Link} from 'react-router-dom';

/**
 * Header component
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
  setSignedIn: PropTypes.func.isRequired,
  signedIn: PropTypes.bool.isRequired,
};


export default Header;
