import React from 'react';

import '../styles/Header.less';
import {Layout} from 'antd';
import Navbar from './Navbar';
import {useTheme} from '../ThemeContext';

/**
 * Header component
 * @return {JSX.Element}
 */
function Header() {
  const {theme} = useTheme();
  return (
    <Layout.Header className={`header ${theme}`}>
      <h2 className="logo">We Sell Houses</h2>
      <Navbar />
    </Layout.Header>
  );
}


export default Header;
