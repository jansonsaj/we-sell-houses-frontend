import {message} from 'antd';

/**
 * A disappearing message conditional on query string parameters
 * message and message-type
 * @param {object} location Location from react-router-dom
 */
function showQueryStringMessage(location) {
  const queryParameters = new URLSearchParams(location.search);
  const messageText = queryParameters.get('message');
  if (messageText) {
    const messageType = queryParameters.get('message-type') || 'success';
    message[messageType](messageText);
  }
}

export {showQueryStringMessage};
