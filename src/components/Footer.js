import React from 'react';

import '../styles/Footer.less';
import {Layout} from 'antd';

/**
 * Footer component
 * @return {JSX.Element}
 */
function Footer() {
  return (
    <Layout.Footer className="footer">
        We Sell Houses ©2020 Created by Andris Jansons
    </Layout.Footer>
  );
}

export default Footer;
