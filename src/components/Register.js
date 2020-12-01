import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Content.less';
import {
  UserOutlined, LockOutlined, PlusCircleOutlined,
} from '@ant-design/icons';
import {Layout, Card, Form, Input, Button, Alert, message} from 'antd';
import {Link, withRouter} from 'react-router-dom';

const rules = {
  signUpCode: [{
    required: true,
    message: 'You need to provide an sign-up code',
  }],
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
  confirmPassword: [{
    required: true,
    message: 'Please confirm your Password!',
  },
  ({getFieldValue}) => ({
    validator(rule, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(
          new Error('The two passwords that you entered do not match!'));
    },
  })],
};

/**
 * Sign in component
 */
class Register extends React.Component {
  state = {
    loading: false,
    alert: null,
  };

  /**
   * Posts the form entries to the sign up endpoint
   * @param {object} values Form entries
   */
  onRegisterClick = async (values) => {
    this.setState({loading: true});
    const data = {
      signUpCode: values.signUpCode,
      email: values.email,
      password: values.password,
    };
    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users`,
        options,
    );

    this.setState({loading: false});
    if (response.status === 201) {
      message.success('Account created. You can log in now');
      this.props.history.push('/signin');
    } else {
      this.displayAlertMessage(response, values.email);
    }
  };

  /**
   * Displays an alert message based on the response status
   * @param {object} response Failed response
   * @param {string} email Email provided at sign in
   */
  displayAlertMessage = async (response, email) => {
    let alertMessage;
    if (response.status === 403) {
      alertMessage = await response.text();
    } else {
      alertMessage = 'Unable to create an account. Please try again later';
    }
    this.setState({
      alert: {
        type: 'error',
        message: alertMessage,
      }});
  }

  /**
   * Render register component
   * @return {JSX.Element}
   */
  render() {
    return (
      <Layout.Content className="content">
        <Card title="Create an account" className="width-medium">
          <Form onFinish={this.onRegisterClick}>
            <Form.Item>
              <p>
              Creating an account is for property sellers/agents only.
              To create an account, you will need to provide a Sign-Up Code.
              If you do not have a Sign-Up Code, you can request one by
              contacting us at: <a href="mailto:jansonsa@uni.coventry.ac.uk">
              jansonsa@uni.coventry.ac.uk</a>
              </p>
            </Form.Item>
            { this.state.alert &&
                <Form.Item>
                  <Alert
                    message={this.state.alert.message}
                    type={this.state.alert.type} />
                </Form.Item>
            }
            <Form.Item
              name="signUpCode"
              rules={rules.signUpCode}>
              <Input
                prefix={<PlusCircleOutlined />}
                placeholder="Sign-up code" />
            </Form.Item>
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
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={rules.confirmPassword}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={this.state.loading}
                className="button-block">
                    Create an account
              </Button>
            </Form.Item>
            <Form.Item className="text-center">
              <p>Already have an account?
                <Button type="link" htmlType="button">
                  <Link to="/signin">Sign in</Link>
                </Button>
              </p>
            </Form.Item>
          </Form>
        </Card>
      </Layout.Content>
    );
  }
}

Register.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default withRouter(Register);
