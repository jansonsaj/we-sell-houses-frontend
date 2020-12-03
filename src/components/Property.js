import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Content.less';
import {
  Skeleton,
  Layout,
  Result,
  Typography,
  Card,
  Image,
  Statistic,
  Row,
  Col,
  Divider,
  Tabs,
  Tooltip,
  PageHeader,
  Button,
  Popconfirm,
  message,
} from 'antd';
import {EditOutlined, MessageOutlined, DeleteOutlined} from '@ant-design/icons';
import {withRouter, Link} from 'react-router-dom';
import Carousel from './Carousel';
import moment from 'moment';

const colLayout = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 6,
  xl: 6,
  xxl: 6,
};

/**
 * Capitalizes the first letter of the string
 * @param {string} string String to capitalize
 * @return {string} Capitalized string
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Converts specific camel-cased types to human readable strings
 * @param {string} type Camel-cased type
 * @return {string} Human readable type
 */
function typeFormatter(type) {
  if (type === 'semiDetached') {
    return 'Semi-detached';
  }
  if (type === 'endOfTerrace') {
    return 'End of terrace';
  }
  return capitalize(type);
}

/**
 * Converts specific camel-cased statuses to human readable strings
 * @param {string} status Camel-cased status
 * @return {string} Human readable status
 */
function statusFormatter(status) {
  if (status === 'underOffer') {
    return 'Under offer';
  }
  return capitalize(status);
}

/**
 * Formats the price by prepending a £ sign
 * and adding a thousand separator comma
 * @param {number} price Selected price
 * @return {string} Formatted price
 */
function priceFormatter(price) {
  const number = Number(price);
  if (isNaN(number) || number === 0) {
    return 'Contact seller for price';
  }
  return `£ ${price ? price : 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


/**
 * Property component for displaying all the details
 * of a specific property and dynamic actions based on
 * whether the user is the owner of the property
 * @component
 */
class Property extends React.Component {
/**
 * Construct property component
 * @param {object} props Component's properties
 */
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      property: null,
      notFound: false,
      deleteVisible: false,
      deleteLoading: false,
    };
    this.getProperty();
  }

  /**
   * Get a property by ID
   * @param {string} propertyId Property ID
   */
  getProperty = async () => {
    this.setState({loading: true});
    const propertyId = this.props.match.params.id;
    const url = `${process.env.REACT_APP_API_URL}/properties/${propertyId}`;

    const options = {
      method: 'GET',
      headers: {},
    };
    if (this.props.signedIn) {
      options.headers['x-access-token'] = localStorage.getItem('accessToken');
    }

    const response = await fetch(url, options);

    if (response.status === 200) {
      this.setState({property: await response.json()});
    } else {
      this.setState({notFound: true});
    }
    this.setState({loading: false});
  }

  /**
   * Toggle show or hide delete popconfirm
   */
  toggleDeletePopconfirm = () => {
    this.setState({deleteVisible: !this.state.deleteVisible});
  }

  /**
   * Navigate back to the previous page
   */
  goToPreviousPage = () => {
    this.props.history.goBack();
  }

  /**
   * Delete current property
   */
  deleteProperty = async () => {
    this.setState({deleteLoading: true});
    const propertyId = this.state.property._id;
    const url = `${process.env.REACT_APP_API_URL}/properties/${propertyId}`;

    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': localStorage.getItem('accessToken'),
      },
    };

    const response = await fetch(url, options);

    if (response.status === 200) {
      this.goToPreviousPage();
    } else {
      message.error('Unable to delete property. Try again later');
    }
    this.setState({deleteLoading: false});
  }

  /**
   * Property card actions depending on whether the user is
   * the owner of the property
   * @return {JSX.Element[]}
   */
  cardActions = () => {
    if (this.state.property.ownerId === localStorage.getItem('userId')) {
      return [
        <Tooltip key="edit" title="Edit property">
          <Link to={`/properties/${this.state.property._id}/update`}>
            <EditOutlined />
          </Link>
        </Tooltip>,
      ];
    } else {
      return [
        <Tooltip key="message" title="Message property owner">
          <Link to={{
            pathname: '/new-message',
            search: `?propertyId=${this.state.property._id}` +
            `&receiverUserId=${this.state.property.ownerId}`,
          }}>
            <MessageOutlined />
          </Link>
        </Tooltip>,
      ];
    }
  }

  /**
   * Property header actions depending on whether the user
   * is the owner of the property
   * @return {JSX.Element[]}
   */
  headerActions = () => {
    if (this.state.property.ownerId === localStorage.getItem('userId')) {
      return [
        <Button key="edit" type="primary">
          <Link to={`/properties/${this.state.property._id}/update`}>
            <EditOutlined /> Edit property
          </Link>
        </Button>,
        <Popconfirm
          key="delete"
          title={
            `Are you sure you want to delete this property?
            This action cannot be undone`
          }
          placement="bottom"
          visible={this.state.deleteVisible}
          onConfirm={this.deleteProperty}
          okText="Delete"
          okButtonProps={{
            loading: this.state.deleteLoading,
            danger: true,
          }}
          onCancel={this.toggleDeletePopconfirm}
        >
          <Button danger type="primary" onClick={this.toggleDeletePopconfirm}>
            <DeleteOutlined />Delete property
          </Button>
        </Popconfirm>,
      ];
    } else {
      return [
        <Button key="message" type="primary">
          <Link to={{
            pathname: '/new-message',
            search: `?propertyId=${this.state.property._id}` +
            `&receiverUserId=${this.state.property.ownerId}`,
          }}>
            <MessageOutlined /> Message property owner
          </Link>
        </Button>,
      ];
    }
  }

  /**
   * Build a carousel of files
   * @return {JSX.Element}
   */
  fileList = () => {
    const fileList = [];
    const {files} = this.state.property;

    const style = {maxHeight: '448px', height: '56vw'};

    if (files && files.length !== 0) {
      files.forEach((file, i) => {
        const src = `${process.env.REACT_APP_API_URL}/${file.fileLocation}`;
        if (file.type.startsWith('image')) {
          fileList.push(
              <Image
                key={i}
                width='100%'
                style={style}
                src={src}
              />,
          );
        } else if (file.type.startsWith('video')) {
          fileList.push(
              <video
                key={i}
                width="100%"
                controls
                style={style}>
                <source src={src} type={file.type}/>
              </video>,
          );
        }
      });
    }
    return fileList;
  }

  /**
   * Render property component
   * @return {JSX.Element}
   */
  render() {
    const {property} = this.state;

    const features = [];
    if (property) {
      for (const feature of property.features) {
        features.push(<li>{feature}</li>);
      }
    }

    return (
      <Layout.Content className="content content-vertical">
        {
          this.state.loading &&
          <Skeleton paragraph={{rows: 6}} active className="property-card"/>
        }
        {
          this.state.notFound &&
          <Result
            status="warning"
            title="Property not found."
            extra={
              <p>
                  This property could have been archived or deleted.
                  If you are the property owner, make sure you have signed in.
              </p>
            }/>
        }
        {
          property &&
            <Card
              className="property-card"
              cover={
                <PageHeader
                  onBack={this.goToPreviousPage}
                  title={property.title}
                  extra={this.headerActions()}
                >
                  <Row justify="center">
                    <Col span={22}>
                      <Carousel>
                        {this.fileList()}
                      </Carousel>
                    </Col>
                  </Row>
                </PageHeader>
              }
              actions={this.cardActions()}
            >
              <Tabs defaultActiveKey="info" size="large" type="line">
                <Tabs.TabPane tab="Info" key="info">
                  <Row gutters={[16, 20]}>
                    <Col {...colLayout}>
                      <Statistic
                        title="Asking price"
                        value={property.price}
                        valueStyle={{fontWeight: 'bold'}}
                        formatter={priceFormatter} />
                    </Col>
                    <Col {...colLayout}>
                      <Statistic
                        title="Type"
                        value={property.type}
                        formatter={typeFormatter} />
                    </Col>
                    <Col {...colLayout}>
                      <Statistic
                        title="Status"
                        value={property.status}
                        formatter={statusFormatter} />
                    </Col>
                    <Col {...colLayout}>
                      <Statistic
                        title="Priority"
                        value={property.priority}
                        formatter={capitalize} />
                    </Col>
                  </Row>
                  <Divider />
                  <Typography.Title level={2}>
                    {property.title}
                  </Typography.Title>
                  <Divider />
                  <Typography.Text>Features:</Typography.Text>
                  <ul>
                    {features}
                  </ul>
                  <Divider />
                  <Typography.Paragraph className="description">
                    {property.description}
                  </Typography.Paragraph>
                  <Typography.Text type="secondary">
                    Listed {moment(property.createdAt).fromNow()}
                  </Typography.Text>
                  {
                    property.createdAt !== property.updatedAt &&
                    <>
                      <Divider type="vertical" />
                      <Typography.Text type="secondary">
                      Updated {moment(property.updatedAt).fromNow()}
                      </Typography.Text>
                    </>
                  }
                </Tabs.TabPane>

                <Tabs.TabPane tab="Location" key="location">
                  {
                    !property.location &&
                    <Typography.Text>
                      Contact the owner for location by using
                      the <MessageOutlined /> button below
                    </Typography.Text>
                  }
                  {
                    property.location && property.location.addressLine1 &&
                    <Statistic
                      title="Address line 1"
                      value={property.location.addressLine1}
                      formatter={capitalize} />
                  }
                  {
                    property.location && property.location.addressLine2 &&
                    <Statistic
                      title="Address line 2"
                      value={property.location.addressLine2}
                      formatter={capitalize} />
                  }
                  {
                    property.location && property.location.town &&
                    <Statistic
                      title="Town"
                      value={property.location.town}
                      formatter={capitalize} />
                  }
                  {
                    property.location && property.location.county &&
                    <Statistic
                      title="County"
                      value={property.location.county}
                      formatter={capitalize} />
                  }
                  {
                    property.location && property.location.postcode &&
                    <Statistic
                      title="Postcode"
                      value={property.location.postcode}
                      formatter={capitalize} />
                  }
                </Tabs.TabPane>
              </Tabs>
            </Card>
        }
      </Layout.Content>
    );
  }
}

Property.propTypes = {
  /** Matched path parameters from react-router */
  match: PropTypes.object.isRequired,
  /** History from react-router */
  history: PropTypes.object.isRequired,
  /** Location from react-router */
  location: PropTypes.object.isRequired,
  /** Whether the user is signed in or not */
  signedIn: PropTypes.bool.isRequired,
};


export default withRouter(Property);
