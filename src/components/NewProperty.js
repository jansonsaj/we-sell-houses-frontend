import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Content.less';
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Alert,
  Select,
  InputNumber,
  Divider,
} from 'antd';
import {withRouter} from 'react-router-dom';
import FileUpload from './FileUpload';

const {Option} = Select;

const formLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};

const rules = {
  type: [{
    required: true,
    message: 'A type is required!',
  }],
  title: [{
    required: true,
    message: 'A title is required!',
  }],
  price: [{
    min: 0,
    message: 'Price can\'t be negative',
  }],
  addressLine1: [{
    required: true,
    message: 'An address is required!',
  },
  {
    max: 255,
    message: 'An address can\'t be longer than 255 characters!',
  }],
  addressLine2: [{
    max: 255,
    message: 'An address can\'t be longer than 255 characters!',
  }],
  town: [{
    required: true,
    message: 'A town is required!',
  },
  {
    max: 35,
    message: 'A town can\'t be longer than 35 characters!',
  }],
  county: [{
    max: 35,
    message: 'A county can\'t be longer than 35 characters!',
  }],
  postcode: [{
    required: true,
    message: 'A postcode is required!',
  },
  {
    max: 8,
    message: 'A postcode can\'t be longer than 8 characters!',
  }],
};

const features = [
  'Garden',
  'Parking',
  'Off-road parking',
  'Garage',
  'New home',
  'Central heating',
  'Fireplace',
  'Double glazing',
  'Reliable broadband signal',
  'Good energy efficieny rating',
  'Friendly neighbours',
  'Local shops and amenities',
  'Bath',
  'Shower',
  'Home security system',
  'Open-plan layout',
];

/**
 * Formats the input price by prepending a £ sign
 * and adding a thousand separator comma
 * @param {number} price Selected price
 * @return {string} Formatted price
 */
function priceFormatter(price) {
  return `£ ${price ? price : 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Parses the formatted price to only extract the
 * number value
 * @param {string} price Formatted price
 * @return {number} Parsed price
 */
function priceParser(price) {
  return parseInt(price.replace(/\£\s?|(,*)/g, ''));
}

/**
 * New property component, that displays a form
 * for adding new properties
 */
class NewProperty extends React.Component {
  state = {
    loading: false,
    alert: null,
    uploadedFiles: [],
  };

  /**
   * Posts the form entries to the add property endpoint
   * @param {object} values Form entries
   */
  onSubmit = async (values) => {
    this.setState({loading: true});
    const data = {
      files: this.state.uploadedFiles,
      ...values,
    };
    if (!data.price) {
      data.price = 0;
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('accessToken'),
      },
    };

    const response = await fetch(
        `${process.env.REACT_APP_API_URL}/properties`,
        options,
    );

    this.setState({loading: false});
    if (response.status === 201) {
      this.onPropertyCreated(await response.json());
    } else {
      this.displayAlertMessage(response);
    }
  };

  /**
   * When property has successfully been created, redirect
   * to its detail page
   * @param {object} property Newly created property
   */
  onPropertyCreated = (property) => {
    this.props.history.push(`/properties/${property._id}`);
  }

  /**
   * Displays an alert message based on the response status
   * @param {object} response Failed response
   */
  displayAlertMessage = async (response) => {
    let alertMessage;
    if (response.status === 403) {
      alertMessage = await response.text();
    } else {
      alertMessage = 'Unable to create a property. Please try again later';
    }
    this.setState({
      alert: {
        type: 'error',
        message: alertMessage,
      }});
  }

  /**
   * Update the list of uploaded files
   * @param {object[]} uploadedFiles Uploaded files
   */
  setUploadedFiles = (uploadedFiles) => {
    this.setState({uploadedFiles});
  }

  /**
   * Render new property form
   * @return {JSX.Element}
   */
  render() {
    const featureOptions = [];
    for (const feature of features) {
      featureOptions.push(<Option key={feature}>{feature}</Option>);
    }

    return (
      <Layout.Content className="content">
        <Card title="Add a new property" className="width-medium">
          <Form onFinish={this.onSubmit} {...formLayout}>
            { this.state.alert &&
                <Form.Item wrapperCol={{span: 24}}>
                  <Alert
                    message={this.state.alert.message}
                    type={this.state.alert.type} />
                </Form.Item>
            }
            <Form.Item label="Pictures and videos">
              <FileUpload setUploadedFiles={this.setUploadedFiles}/>
            </Form.Item>
            <Form.Item
              name="type"
              label="Type"
              rules={rules.type}>
              <Select placeholder="Select a property type">
                <Option value="flat">Flat</Option>
                <Option value="terrace">Terrace</Option>
                <Option value="endOfTerrace">End of terrace</Option>
                <Option value="detached">Detached</Option>
                <Option value="semiDetached">Semi-detached</Option>
                <Option value="cottage">Cottage</Option>
                <Option value="bungalow">Bungalow</Option>
                <Option value="mansion">Mansion</Option>
                <Option value="commercial">Commercial</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="title"
              label="Title"
              rules={rules.title}>
              <Input placeholder="A victorian flat in the heart of London" />
            </Form.Item>
            <Form.Item
              name="features"
              label="Features">
              <Select mode="tags"
                tokenSeparators={[',']}
                placeholder="Select features or add your own">
                {featureOptions}
              </Select>
            </Form.Item>
            <Form.Item
              name="priority"
              label="Priority">
              <Select defaultValue="normal">
                <Option value="normal">Normal</Option>
                <Option value="high">High</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="price"
              label="Asking price">
              <InputNumber
                className="w-100"
                min={0}
                defaultValue={0}
                formatter={priceFormatter}
                parser={priceParser} />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description">
              <Input.TextArea placeholder="Number of bedrooms..." autoSize />
            </Form.Item>
            <Divider plain>Location</Divider>
            <Form.Item
              name={['location', 'addressLine1']}
              label="Address line 1"
              rules={rules.addressLine1}>
              <Input />
            </Form.Item>
            <Form.Item
              name={['location', 'addressLine2']}
              label="Address line 2"
              rules={rules.addressLine2}>
              <Input />
            </Form.Item>
            <Form.Item
              name={['location', 'town']}
              label="Town"
              rules={rules.town}>
              <Input />
            </Form.Item>
            <Form.Item
              name={['location', 'county']}
              label="County"
              rules={rules.county}>
              <Input />
            </Form.Item>
            <Form.Item
              name={['location', 'postcode']}
              label="Postcode"
              rules={rules.postcode}>
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{span: 24}}>
              <Button
                type="primary"
                htmlType="submit"
                loading={this.state.loading}
                className="button-block">
                  Add the property
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Layout.Content>
    );
  }
}

NewProperty.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};


export default withRouter(NewProperty);
