import React from 'react';

import '../styles/Content.less';
import {Typography, Layout, Row, Col, Button} from 'antd';
import {Link} from 'react-router-dom';

const colLayout = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 12,
  xxl: 12,
};

/**
 * Home page
 * @component
 * @return {JSX.Element}
 */
function Home() {
  return (
    <Layout.Content className="content content-vertical">
      <Typography.Title type="secondary">We Sell Houses</Typography.Title>
      <Row gutter={[16, 20]}>
        <Col {...colLayout}>
          <Typography.Title level={3}>
            For everyone
          </Typography.Title>
          <Typography.Paragraph>
            Looking for your next house?
            Find your dream property!
          </Typography.Paragraph>
          <Button type="primary">
            <Link to="/properties">
              Explore properties
            </Link>
          </Button>
        </Col>
        <Col {...colLayout}>
          <Typography.Title level={3}>
            For property owners and agents
          </Typography.Title>
          <Typography.Paragraph>
            Join We Sell Houses and we will find the
            next owner for your property!
          </Typography.Paragraph>
          <Button type="primary">
            <Link to="/register">
              Create an account
            </Link>
          </Button>
        </Col>
      </Row>
    </Layout.Content>
  );
}

export default Home;
