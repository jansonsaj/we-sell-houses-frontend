import React from 'react';
import PropTypes from 'prop-types';

import {
  Form,
  Row,
  Col,
  Input,
  Collapse,
  InputNumber,
  Select,
  Switch,
  Button,
} from 'antd';
import {FilterOutlined} from '@ant-design/icons';

const colLayout = {
  xs: 24,
  sm: 24,
  md: 8,
  lg: 8,
  xl: 8,
  xxl: 8,
};

/**
 * Property tile component for displaying the most
 * important information about a property in a list
 * @param {object} props Component properties
 * @return {JSX.Element}
 */
function PropertyFilter(props) {
  const {searchParams, setSearchParams, loading, signedIn} = props;

  /**
   * When search button is clicked, set search params
   * @param {object} values Form values
   */
  function onFinish(values) {
    const data = {...values};
    if (data.status) {
      data.status = 'listed';
    } else {
      data.status = null;
    }
    if (data.ownerId) {
      data.ownerId = localStorage.getItem('userId');
    } else {
      data.ownerId = null;
    }
    setSearchParams(data);
  }

  /**
   * Get initial values for the form fields from search params
   * @return {object[]} Return form fields
   */
  function initialFormFields() {
    const formFields = [];
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key]) {
        formFields.push({name: [key], value: searchParams[key]});
      }
    });
    return formFields;
  }
  return (
    <Collapse expandIconPosition='right' className="property-filters">
      <Collapse.Panel
        header='Filters (Price, area, features...)'
        extra={<FilterOutlined />}>
        <Form
          layout='vertical'
          onFinish={onFinish}
          fields={initialFormFields()}>
          <Row gutter={[16, 20]}>

            <Col {...colLayout}>
              <Input.Group compact>
                <Form.Item
                  className="price-input"
                  label="Min price"
                  name="priceLow">
                  <InputNumber
                    min={0}
                    placeholder="Minimum" />
                </Form.Item>
                <Form.Item
                  className="price-input"
                  label="Max price"
                  name="priceHigh">
                  <InputNumber
                    min={0}
                    placeholder="Maximum"
                  />
                </Form.Item>
              </Input.Group>
              <Form.Item
                label="Sort by"
                name="sort">
                <Select defaultValue="createdAt">
                  <Select.Option value="createdAt">Listed time</Select.Option>
                  <Select.Option value="price">Price</Select.Option>
                  <Select.Option value="type">Type</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Sort direction"
                name="sortDirection">
                <Select defaultValue="desc">
                  <Select.Option value="desc">Descending</Select.Option>
                  <Select.Option value="asc">Ascending</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col {...colLayout}>
              <Form.Item
                label="Postcode"
                name="postcode">
                <Input />
              </Form.Item>
              <Form.Item
                label="Town"
                name="town">
                <Input />
              </Form.Item>
              <Form.Item
                label="County"
                name="county">
                <Input />
              </Form.Item>
            </Col>

            <Col {...colLayout}>
              <Form.Item
                label="Text search"
                name="search">
                <Input placeholder="Search in title and description"/>
              </Form.Item>
              <Form.Item
                valuePropName="checked"
                label="Exclude under offer"
                name="status">
                <Switch />
              </Form.Item>
              {signedIn &&
                <Form.Item
                  valuePropName="checked"
                  label="Only my added properties"
                  name="ownerId">
                  <Switch />
                </Form.Item>
              }
            </Col>

            <Col span={24}>
              <Form.Item>
                <Button
                  htmlType='submit'
                  type='primary'
                  loading={loading}
                  className="button-block">
                Search
                </Button>
              </Form.Item>
            </Col>

          </Row>
        </Form>
      </Collapse.Panel>
    </Collapse>
  );
}

PropertyFilter.propTypes = {
  loading: PropTypes.bool.isRequired,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.object.isRequired,
  signedIn: PropTypes.bool.isRequired,
};

export default PropertyFilter;
