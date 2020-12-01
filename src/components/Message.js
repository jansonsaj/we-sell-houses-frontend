import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Content.less';
import {
  Skeleton,
  Layout,
  Result,
  Typography,
  Card,
  Statistic,
  Row,
  Col,
  Divider,
  PageHeader,
  Button,
  Popconfirm,
  List,
  message,
} from 'antd';
import {FolderOpenOutlined, DeleteOutlined} from '@ant-design/icons';
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import PropertyTile from './PropertyTile';

const colLayout = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 12,
  xxl: 12,
};

/**
 * Message component
 */
class Message extends React.Component {
/**
 * Construct message component
 * @param {object} props Component's properties
 */
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      message: null,
      property: null,
      notFound: false,
      deleteVisible: false,
      deleteLoading: false,
      changeStateLoading: false,
    };
    this.getAndReadMessage();
  }

  /**
   * Get the message by id, if its status is
   * sent (unread) change it to read, and get
   * the associated property.
   */
  getAndReadMessage = async () => {
    this.setState({loading: true});

    const message = await this.getMessage();
    if (message) {
      if (message.status === 'sent') {
        await this.changeMessageStatus('read', message._id);
      }
      await this.getProperty(message.propertyId);
    }

    this.setState({loading: false});
  }

  /**
   * Get a message by ID
   * @param {string} messageId Message ID
   * @return {object} Return message
   */
  getMessage = async () => {
    const messageId = this.props.match.params.id;
    const url = `${process.env.REACT_APP_API_URL}/messages/${messageId}`;

    const options = {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.getItem('accessToken'),
      },
    };

    const response = await fetch(url, options);
    let message;

    if (response.status === 200) {
      message = await response.json();
      this.setState({message});
    } else {
      this.setState({notFound: true});
    }
    return message;
  }

  /**
   * Get the associated property by ID
   * @param {string} propertyId Property ID
   */
  getProperty = async (propertyId) => {
    const url = `${process.env.REACT_APP_API_URL}/properties/${propertyId}`;

    const options = {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.getItem('accessToken'),
      },
    };

    const response = await fetch(url, options);

    if (response.status === 200) {
      this.setState({property: await response.json()});
    }
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
   * Change message status to archived
   */
  archiveMessage = () => {
    this.changeMessageStatus('archived');
  }

  /**
   * Change message status to read
   */
  unarchiveMessage = () => {
    this.changeMessageStatus('read');
  }

  /**
   * Change the status of the current message
   * @param {string} status The new status to set
   * @param {string} id Optional ID of the message
   */
  changeMessageStatus = async (status, id) => {
    this.setState({changeStatusLoading: true});
    const messageId = id || this.state.message._id;
    const url = `${process.env.REACT_APP_API_URL}/messages/${messageId}`;

    const options = {
      method: 'PUT',
      body: JSON.stringify({status}),
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('accessToken'),
      },
    };

    const response = await fetch(url, options);

    if (response.status === 200) {
      await this.getMessage();
    } else {
      message.error('Unable to change message status. Try again later');
    }
    this.setState({changeStatusLoading: false});
  }

  /**
   * Delete current message
   */
  deleteMessage = async () => {
    this.setState({deleteLoading: true});
    const messageId = this.state.message._id;
    const url = `${process.env.REACT_APP_API_URL}/messages/${messageId}`;

    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': localStorage.getItem('accessToken'),
      },
    };

    const response = await fetch(url, options);

    if (response.status === 200) {
      message.success('Message deleted');
      this.goToPreviousPage();
    } else {
      message.error('Unable to delete message. Try again later');
    }
    this.setState({deleteLoading: false});
  }

  /**
   * Message header actions depending on whether the message
   * is already archived or not
   * @return {JSX.Element[]}
   */
  headerActions = () => {
    const actions = [];
    if (this.state.message.status === 'archived') {
      actions.push(
          <Button
            key="unarchive"
            type="primary"
            onClick={this.unarchiveMessage}
            loading={this.state.changeStateLoading}>
            <FolderOpenOutlined /> Unarchive
          </Button>,
      );
    } else {
      actions.push(
          <Button
            key="archive"
            type="primary"
            onClick={this.archiveMessage}
            loading={this.state.changeStateLoading}>
            <FolderOpenOutlined /> Archive
          </Button>,
      );
    }
    actions.push(
        <Popconfirm
          key="delete"
          title={
            `Are you sure you want to delete this message?
            This action cannot be undone`
          }
          placement="bottom"
          visible={this.state.deleteVisible}
          onConfirm={this.deleteMessage}
          okText="Delete"
          okButtonProps={{
            loading: this.state.deleteLoading,
            danger: true,
          }}
          onCancel={this.toggleDeletePopconfirm}
        >
          <Button danger type="primary" onClick={this.toggleDeletePopconfirm}>
            <DeleteOutlined /> Delete
          </Button>
        </Popconfirm>,
    );
    return actions;
  }

  /**
   * Render message component
   * @return {JSX.Element}
   */
  render() {
    const {message} = this.state;

    if (this.state.loading) {
      return (
        <Layout.Content className="content content-vertical">
          <Skeleton paragraph={{rows: 6}} active className="message-card"/>
        </Layout.Content>
      );
    }

    if (this.state.notFound) {
      return (
        <Layout.Content className="content content-vertical">
          <Result
            status="warning"
            title="Message not found."
            extra={
              <p>
                  This message could have been deleted.
                  Otherwise, please try again later.
              </p>
            }/>
        </Layout.Content>
      );
    }

    return (
      <Layout.Content className="content content-vertical">
        <Card
          className="message-card"
          cover={
            <PageHeader
              title="Message"
              subTitle={`(${message.status})`}
              onBack={this.goToPreviousPage}
              extra={this.headerActions()} />
          }
        >
          {
            this.state.property &&
            <>
              <Divider plain>Regarding property</Divider>
              <List
                className="property-list"
                itemLayout="vertical"
                dataSource={[this.state.property]}
                renderItem={(property) => (
                  <PropertyTile property={property} />
                )} />
            </>
          }
          <Divider plain>Sender</Divider>
          <Row gutter={[16, 20]}>
            <Col {...colLayout}>
              <Statistic title="Email" value={message.senderEmail} />
            </Col>
            {
              message.senderPhone &&
              <Col {...colLayout}>
                <Statistic title="Phone" value={message.senderPhone} />
              </Col>
            }
          </Row>
          <Divider plain>Message</Divider>
          <Typography.Paragraph className="body">
            {message.body}
          </Typography.Paragraph>
          <Typography.Text type="secondary">
            Received {moment(message.createdAt).fromNow()}
          </Typography.Text>
          {
            message.createdAt !== message.updatedAt &&
            <>
              <Divider type="vertical" />
              <Typography.Text type="secondary">
              Status changed {moment(message.updatedAt).fromNow()}
              </Typography.Text>
            </>
          }
        </Card>
      </Layout.Content>
    );
  }
}

Message.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(Message);
