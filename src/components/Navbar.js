import React from 'react';

import {Menu} from 'antd';
import {HomeOutlined, SettingOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';

const {SubMenu, Item, ItemGroup} = Menu;

/**
 * Navigation bar
 * @return {JSX.Element}
 */
function Navbar() {
  return (
    <Menu mode="horizontal">
      <Item icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Item>
      <SubMenu icon={<SettingOutlined />} title="Submenu">
        <ItemGroup title="Item 1">
          <Item>Option 1</Item>
          <Item>Option 2</Item>
        </ItemGroup>
        <ItemGroup title="Item 2">
          <Item>Option 3</Item>
          <Item>Option 4</Item>
        </ItemGroup>
      </SubMenu>
    </Menu>
  );
}

export default Navbar;
