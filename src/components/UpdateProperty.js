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
  message,
  Skeleton,
  PageHeader,
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
 * Update property component, that displays a form
 * for updating existing properties and their images
 * @component
 */
class UpdateProperty extends React.Component {
  /**
   * Construct Update property component
   * @param {object} props Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      alert: null,
      property: null,
      uploadedFiles: [],
    };
    this.getProperty();
  }

  /**
   * Get a property by ID
   * @param {string} propertyId Property ID
   */
  getProperty = async () => {
    const propertyId = this.props.match.params.id;
    const url = `${process.env.REACT_APP_API_URL}/properties/${propertyId}`;

    const options = {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.getItem('accessToken'),
      },
    };

    const response = await fetch(url, options);

    if (response.status === 200) {
      const property = await response.json();
      this.setState({property, uploadedFiles: property.files});
    } else {
      message.error('Cannot load property. Try reloading the page');
    }
  }

  /**
   * Update the list of uploaded files
   * @param {object[]} uploadedFiles Uploaded files
   */
  setUploadedFiles = (uploadedFiles) => {
    this.setState({uploadedFiles});
  }

  /**
   * Get initial values for the form fields from property
   * @return {object[]} Return form fields
   */
  initialFormFields = () => {
    const {location, price, ...property} = this.state.property;
    const excludeKeys = ['ownerId', '_id', 'id', 'location', 'price'];
    const formFields = [];
    Object.keys(property).forEach((key) => {
      if (!excludeKeys.includes(key) && property[key]) {
        formFields.push({name: [key], value: property[key]});
      }
    });
    Object.keys(location).forEach((key) => {
      if (location[key]) {
        formFields.push({name: ['location', key], value: location[key]});
      }
    });
    if (isNaN(Number(price))) {
      formFields.push({name: ['price'], value: 0});
    } else {
      formFields.push({name: ['price'], value: Number(price)});
    }
    return formFields;
  }


  /**
   * Posts the form entries to the add property endpoint
   * @param {object} values Form entries
   */
  onSubmit = async (values) => {
    this.setState({loading: true});
    const propertyId = this.state.property._id;
    const url = `${process.env.REACT_APP_API_URL}/properties/${propertyId}`;
    const data = {
      files: this.state.uploadedFiles,
      ...values,
    };

    const options = {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('accessToken'),
      },
    };

    const response = await fetch(url, options);

    this.setState({loading: false});
    if (response.status === 200) {
      this.goToPreviousPage();
    } else {
      this.displayAlertMessage(response);
    }
  };

  /**
   * Displays an alert message based on the response status
   * @param {object} response Failed response
   */
  displayAlertMessage = async (response) => {
    let alertMessage;
    if (response.status === 404 || response.status === 401) {
      alertMessage = await response.text();
    } else {
      alertMessage = 'Unable to update the property. Please try again later';
    }
    this.setState({
      alert: {
        type: 'error',
        message: alertMessage,
      }});
  }

  /**
   * Navigate back to the previous page
   */
  goToPreviousPage = () => {
    this.props.history.goBack();
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

    if (!this.state.property) {
      return (
        <Layout.Content className="content">
          <Skeleton paragraph={{rows: 6}} active className="property-card"/>
        </Layout.Content>
      );
    }

    return (
      <Layout.Content className="content">
        <Card
          className="width-medium"
          cover={
            <PageHeader
              onBack={this.goToPreviousPage}
              title="Edit property" />
          }>
          <Form
            {...formLayout}
            onFinish={this.onSubmit}
            fields={this.initialFormFields()}>
            { this.state.alert &&
                <Form.Item wrapperCol={{span: 24}}>
                  <Alert
                    message={this.state.alert.message}
                    type={this.state.alert.type} />
                </Form.Item>
            }
            <Form.Item label="Pictures and videos">
              <FileUpload
                initialFiles={this.state.property.files}
                setUploadedFiles={this.setUploadedFiles} />
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
              name="status"
              label="Status">
              <Select defaultValue="listed">
                <Option value="listed">Listed</Option>
                <Option value="underOffer">Under offer</Option>
                <Option value="archived">Archived</Option>
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
                  Update the property
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Layout.Content>
    );
  }
}

UpdateProperty.propTypes = {
  /** Matched path parameters from react-router */
  match: PropTypes.object.isRequired,
  /** History from react-router */
  history: PropTypes.object.isRequired,
  /** Whether the user is signed in or not */
  signedIn: PropTypes.bool.isRequired,
};

export default withRouter(UpdateProperty);
