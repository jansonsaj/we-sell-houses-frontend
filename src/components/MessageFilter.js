import React from 'react';
import PropTypes from 'prop-types';

import {
  Form,
  Row,
  Col,
  Input,
  Collapse,
  Select,
  Button,
} from 'antd';
import {
  FilterOutlined,
  MailOutlined,
  ReadOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';

const colLayout = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 12,
  xxl: 12,
};

/**
 * Property filter component for displaying filters
 * that can be applied for searching properties
 * @param {object} props Component properties
 * @return {JSX.Element}
 */
function MessageFilter(props) {
  const {searchParams, setSearchParams, loading} = props;

  /**
   * When search button is clicked, set search params
   * @param {object} values Form values
   */
  function onFinish(values) {
    const data = {...values};
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
    <Collapse expandIconPosition='right' className="message-filters">
      <Collapse.Panel
        header='Filters'
        extra={<FilterOutlined />}>
        <Form
          layout='vertical'
          onFinish={onFinish}
          fields={initialFormFields()}>
          <Row gutter={[16, 20]}>

            <Col {...colLayout}>
              <Form.Item
                label="Sort by"
                name="sort">
                <Select defaultValue="createdAt">
                  <Select.Option value="createdAt">Received time</Select.Option>
                  <Select.Option value="updatedAt">
                    Status changed time
                  </Select.Option>
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
                label="Message status"
                name="status">
                <Select defaultValue="">
                  <Select.Option value="">All</Select.Option>
                  <Select.Option value="sent">
                    <MailOutlined /> Unread
                  </Select.Option>
                  <Select.Option value="read">
                    <ReadOutlined /> Read
                  </Select.Option>
                  <Select.Option value="archived">
                    <FolderOpenOutlined /> Archived
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Property ID"
                name="propertyId">
                <Input />
              </Form.Item>
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

MessageFilter.propTypes = {
  loading: PropTypes.bool.isRequired,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.object.isRequired,
};

export default MessageFilter;
