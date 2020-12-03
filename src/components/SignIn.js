import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Content.less';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Alert,
  message,
} from 'antd';
import {Link, withRouter} from 'react-router-dom';

const rules = {
  email: [{
    required: true,
    message: 'Please input your Email!',
  },
  {
    type: 'email',
    message: 'That is not a valid Email!',
  }],
  password: [{
    required: true,
    message: 'Please input your Password!',
  },
  {
    min: 6,
    message: 'The Password needs to be longer than 6 characters!',
  }],
};

/**
 * Sign in component that signs users in, provided
 * they have an email and a password of an account
 * @component
 */
class SignIn extends React.Component {
  /**
   * Construct sign in component
   * @param {object} props Component props
   */
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      alert: null,
    };
  }

  /**
   * Posts the form entries to the sign in endpoint
   * @param {object} values Form entries
   */
  onSignInClick = async (values) => {
    this.setState({loading: true});
    const options = {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/signin`,
        options,
    );

    this.setState({loading: false});
    if (response.status === 200) {
      this.signInUser(await response.json());
    } else {
      this.displayAlertMessage(response.status, values.email);
    }
  };

  /**
   * Store the signed in user. If the user tried accessing a
   * protected route and was prompted to sign in, redirect them
   * back to the protected route, otherwise redirect them to
   * home page
   * @param {object} user Signed in user
   */
  signInUser = (user) => {
    localStorage.setItem('userId', user.id);
    localStorage.setItem('accessToken', user.accessToken);
    this.props.setSignedIn(true);
    message.success('You have signed in');

    const {history, location} = this.props;

    if (location.state && location.state.redirectAfterSignIn) {
      history.push(location.state.redirectAfterSignIn);
    } else {
      history.push('/');
    }
  }

  /**
   * Displays an alert message based on the response status
   * @param {number} responseStatus Failed response status code
   * @param {string} email Email provided at sign in
   */
  displayAlertMessage = (responseStatus, email) => {
    let alertMessage;
    if (responseStatus === 400) {
      alertMessage = `There is no user with the email: ${email}`;
    } else if (responseStatus === 401) {
      alertMessage = 'The provided password was invalid';
    } else {
      alertMessage = 'Unable to sign in. Please try again later';
    }
    this.setState({
      alert: {
        type: 'error',
        message: alertMessage,
      }});
  }

  /**
   * Render sign in component
   * @return {JSX.Element}
   */
  render() {
    return (
      <Layout.Content className="content">
        <Row gutter={[16, 16]} className="width-medium">

          <Col xs={24} sm={24} lg={16} xl={16}>
            <Card title="Sign In">
              <Form onFinish={this.onSignInClick}>
                { this.state.alert &&
                <Form.Item>
                  <Alert
                    message={this.state.alert.message}
                    type={this.state.alert.type} />
                </Form.Item>
                }
                <Form.Item
                  name="email"
                  rules={rules.email}>
                  <Input
                    prefix={<UserOutlined />}
                    type="email"
                    placeholder="Email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={rules.password}>
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Password"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={this.state.loading}
                    className="button-block">
                    Sign In
                  </Button>
                </Form.Item>
                <Form.Item className="text-center">
                  <p>New here?
                    <Button type="link" htmlType="button">
                      <Link to="/register">Create an account</Link>
                    </Button>
                  </p>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} sm={24} lg={8} xl={8} className="vertical-center">
            <h3>New to <strong>We Sell Houses</strong>?</h3>
            <p>If you create an account, you will be able to:</p>
            <ul>
              <li>Post properties</li>
              <li>Receive messages from potential buyers</li>
            </ul>
            <Button type="primary" htmlType="button">
              <Link to="/register">Create an account</Link>
            </Button>
          </Col>
        </Row>
      </Layout.Content>
    );
  }
}

SignIn.propTypes = {
  /** History from react-router */
  history: PropTypes.shape({
    push: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  /** Location from react-router */
  location: PropTypes.object,
  /** Update the value of "signedIn" */
  setSignedIn: PropTypes.func.isRequired,
};

export default withRouter(SignIn);
