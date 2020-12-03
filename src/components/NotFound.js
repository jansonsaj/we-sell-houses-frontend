import React from 'react';
import {Result, Button} from 'antd';
import {Link} from 'react-router-dom';

/**
 * 404 Not Found page
 * @component
 * @return {JSX.Element}
 */
function NotFound() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you are looking for does not exist."
      extra={
        <Button type="primary">
          <Link to="/">Back Home</Link>
        </Button>
      }
    />
  );
}

export default NotFound;
