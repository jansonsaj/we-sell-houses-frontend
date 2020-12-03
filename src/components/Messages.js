import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Content.less';
import {withRouter} from 'react-router-dom';
import {Layout, List, Pagination, Alert} from 'antd';
import MessageTile from './MessageTile';
import MessageFilter from './MessageFilter';

const pageSizeOptions = [
  3, 10, 20, 50, 100,
];

/**
 * Messages component, that lists messages
 * according to the selected filters
 * @component
 */
class Messages extends React.Component {
  /**
   * Constructs a component and builds search parameters
   * from the query string
   * @param {object} props Component's properties
   */
  constructor(props) {
    super(props);
    const queryParameters = new URLSearchParams(props.location.search);
    this.state = {
      loading: true,
      alert: null,
      messages: [],
      messageCount: 0,
      searchParams: {
        page: queryParameters.get('page') || 1,
        resultsPerPage: queryParameters.get('resultsPerPage') || 10,
        sort: queryParameters.get('sort'),
        sortDirection: queryParameters.get('sortDirection'),
        receiverUserId: queryParameters.get('receiverUserId'),
        propertyId: queryParameters.get('propertyId'),
        status: queryParameters.get('status'),
      },
    };
    this.getMessages();
  }

  /**
   * Update search params and request new properties according
   * to the property filter component
   * @param {object} updatedSearchParams Search params from filter
   */
  setSearchParams = (updatedSearchParams) => {
    const searchParams = {...this.state.searchParams};
    Object.assign(searchParams, updatedSearchParams);
    searchParams.page = 1;
    this.setState({searchParams});
    this.getMessages();
  }

  /**
   * Constructs a query parameter string with non-empty values
   * from this.state.searchParams
   * @return {string} Constructed query string
   */
  getQueryParameters = () => {
    const queryParameters = new URLSearchParams();
    Object.keys(this.state.searchParams).forEach((key) => {
      if (this.state.searchParams[key]) {
        queryParameters.append(key, this.state.searchParams[key]);
      }
    });
    return queryParameters.toString();
  }

  /**
   * Updates current URL with the query parameters
   */
  updateUrl = () => {
    this.props.history.push({
      pathname: '/messages',
      search: `?${this.getQueryParameters()}`,
    });
  }

  /**
   * Get a list of messages according to the search params
   * @return {JSX.Element}
   */
  getMessages = async () => {
    this.setState({loading: true, alert: null});
    this.updateUrl();

    const url = process.env.REACT_APP_API_URL +
        '/messages?' +
        this.getQueryParameters();

    const options = {
      method: 'GET',
      headers: {
        'x-access-token': localStorage.getItem('accessToken'),
      },
    };

    const response = await fetch(url, options);

    if (response.status === 200) {
      const json = await response.json();
      const searchParams = {...this.state.searchParams};
      searchParams.page = json.page;
      searchParams.resultsPerPage = json.resultsPerPage;
      this.setState({
        messages: json.messages,
        messageCount: json.messageCount,
        searchParams,
      });
    } else {
      this.setState({
        properties: [],
        propertyCount: 0,
        alert: {
          message: 'Invalid filters. Please check your filters and try again.',
          type: 'error',
        },
      });
    }
    this.setState({loading: false});
  }

  /**
   * Request new messages according to the requested page
   * and results per page
   * @param {number} page Selected page
   * @param {number} resultsPerPage Results per page
   */
  onPagination = (page, resultsPerPage) => {
    const searchParams = this.state.searchParams;
    searchParams.page = page;
    searchParams.resultsPerPage = resultsPerPage;
    this.setState({searchParams});
    this.getMessages();
  }

  /**
   * Render a pagination component
   * @return {JSX.Element}
   */
  pagination = () => {
    return (
      <Pagination
        total={this.state.messageCount}
        showTotal={(total) => `Found ${total} messages`}
        current={this.state.searchParams.page}
        pageSize={this.state.searchParams.resultsPerPage}
        pageSizeOptions={pageSizeOptions}
        showSizeChanger
        onChange={this.onPagination}
      />
    );
  }

  /**
   * Render messages list
   * @return {JSX.Element}
   */
  render() {
    return (
      <Layout.Content className="content content-vertical">
        <MessageFilter
          searchParams={this.state.searchParams}
          setSearchParams={this.setSearchParams}
          loading={this.state.loading} />
        {this.state.alert &&
          <Alert
            className="message-alert"
            message={this.state.alert.message}
            type={this.state.alert.type} />
        }
        <List
          className="message-list"
          itemLayout="vertical"
          loading={this.state.loading}
          header={this.pagination()}
          footer={this.pagination()}
          dataSource={this.state.messages}
          renderItem={(message) => (
            <MessageTile message={message} />
          )} />
      </Layout.Content>
    );
  }
}

Messages.propTypes = {
  /** History from react-router */
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  /** Location from react-router */
  location: PropTypes.object,
  /** Whether the user is signed in or not */
  signedIn: PropTypes.bool.isRequired,
};

export default withRouter(Messages);
