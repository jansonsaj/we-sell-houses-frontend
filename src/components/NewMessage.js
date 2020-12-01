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
  Result,
  PageHeader,
  message,
} from 'antd';
import {withRouter} from 'react-router-dom';

const formLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};

const rules = {
  senderEmail: [{
    required: true,
    message: 'Your email is required!',
  }],
  body: [{
    required: true,
    message: 'A message is required!',
  }],
};

/**
 * New message component, that displays a form
 * for sending new messages to property owners
 */
class NewMessage extends React.Component {
  /**
   * Constructs new message component.
   * Extracts propertyId and receiverUserId from query parameters
   * and if either of those values is not present, sets
   * missingRequiredValues to true
   * @param {object} props Component properties
   */
  constructor(props) {
    super(props);
    const queryParameters = new URLSearchParams(props.location.search);
    const propertyId = queryParameters.get('propertyId');
    const receiverUserId = queryParameters.get('receiverUserId');

    this.state = {
      loading: false,
      alert: null,
      propertyId,
      receiverUserId,
      missingRequiredValues: !propertyId || !receiverUserId,
    };
  }

  /**
   * Posts the form entries to the new message endpoint
   * @param {object} values Form entries
   */
  onSubmit = async (values) => {
    this.setState({loading: true});
    const data = {
      ...values,
      propertyId: this.state.propertyId,
      receiverUserId: this.state.receiverUserId,
    };

    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(
        `${process.env.REACT_APP_API_URL}/messages`,
        options,
    );

    if (response.status === 201) {
      this.onMessageSent();
    } else {
      this.setState({
        alert: {
          type: 'error',
          message: 'Unable to send a message. Please try again later',
        }});
    }
    this.setState({loading: false});
  };

  /**
   * When message has successfully been sent, redirect
   * back to the property page
   */
  onMessageSent = () => {
    message.success('Message successfully sent');
    this.goToPreviousPage();
  }

  /**
   * Navigate back to the previous page
   */
  goToPreviousPage = () => {
    this.props.history.goBack();
  }

  /**
   * Render new message form
   * @return {JSX.Element}
   */
  render() {
    if (this.state.missingRequiredValues) {
      return (
        <Result
          status="warning"
          title="Unable to send a message"
          extra={
            <p>
                The property for this message cannot be found.
                To send a message, open a property
                and click &quot;Message property owner&quot;.
            </p>
          }/>
      );
    }
    return (
      <Layout.Content className="content">
        <Card
          className="width-medium"
          cover={
            <PageHeader
              onBack={this.goToPreviousPage}
              title="Message property owner" />
          }>
          <Form onFinish={this.onSubmit} {...formLayout}>
            { this.state.alert &&
                <Form.Item wrapperCol={{span: 24}}>
                  <Alert
                    message={this.state.alert.message}
                    type={this.state.alert.type} />
                </Form.Item>
            }
            <Form.Item
              name="senderEmail"
              label="Your email"
              rules={rules.senderEmail}>
              <Input type="email" />
            </Form.Item>
            <Form.Item
              name="senderPhone"
              label="Your phone number">
              <Input type="tel" />
            </Form.Item>
            <Form.Item
              name="body"
              label="Message"
              rules={rules.body}>
              <Input.TextArea
                placeholder="Schedule a viewing or ask for more details..."
                autoSize />
            </Form.Item>
            <Form.Item wrapperCol={{span: 24}}>
              <Button
                type="primary"
                htmlType="submit"
                loading={this.state.loading}
                className="button-block">
                  Send message
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Layout.Content>
    );
  }
}

NewMessage.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRouter(NewMessage);
