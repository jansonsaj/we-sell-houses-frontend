import React from 'react';
import PropTypes from 'prop-types';

import {useTheme} from '../ThemeContext';
import {List, Typography} from 'antd';
import {
  MailOutlined,
  ReadOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import {withRouter} from 'react-router-dom';

/**
 * Wraps the message body at 100 characters and appends
 * triple dots.
 * @param {string} body Message body
 * @return {string} Wrapped message body
 */
function bodyFormatter(body) {
  const wrapAt = 100;
  if (!body || body.length < wrapAt) {
    return body;
  }
  return `${body.substring(0, wrapAt)}...`;
}

const iconProps = {
  style: {fontSize: '16px'},
};

/**
 * Message tile component for displaying the most
 * important information about a message in a list
 * @param {object} props Component properties
 * @return {JSX.Element}
 */
function MessageTile(props) {
  const {message} = props;
  const {theme} = useTheme();
  let icon;

  switch (message.status) {
    case 'read': icon = <ReadOutlined {...iconProps} />; break;
    case 'archived': icon = <FolderOpenOutlined {...iconProps} />; break;
    default: icon = <MailOutlined {...iconProps} />;
  }

  /**
   * Open message details page
   */
  function openMessage() {
    props.history.push(`/messages/${message._id}`);
  }

  return (
    <List.Item
      key={message._id}
      onClick={openMessage}
      className={`message-list-item status-${message.status} ${theme}`}>
      <List.Item.Meta
        avatar={icon}
        title={
          <Typography.Text>{message.senderEmail}</Typography.Text>
        }
        description={bodyFormatter(message.body)}/>
    </List.Item>
  );
}

MessageTile.propTypes = {
  message: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(MessageTile);
