import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Content.less';
import {withRouter} from 'react-router-dom';
import {Layout, List, Pagination, Alert} from 'antd';
import PropertyTile from './PropertyTile';
import PropertyFilter from './PropertyFilter';

const pageSizeOptions = [
  3, 10, 20, 50, 100,
];

/**
 * Properties component, that lists properties according to the selected filters
 * @component
 */
class Properties extends React.Component {
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
      properties: [],
      propertyCount: 0,
      searchParams: {
        page: queryParameters.get('page') || 1,
        resultsPerPage: queryParameters.get('resultsPerPage') || 10,
        sort: queryParameters.get('sort'),
        sortDirection: queryParameters.get('sortDirection'),
        search: queryParameters.get('search'),
        ownerId: queryParameters.get('ownerId'),
        type: queryParameters.get('type'),
        status: queryParameters.get('status'),
        priority: queryParameters.get('priority'),
        priceLow: queryParameters.get('priceLow'),
        priceHigh: queryParameters.get('priceHigh'),
        town: queryParameters.get('town'),
        county: queryParameters.get('county'),
        postcode: queryParameters.get('postcode'),
      },
    };
    this.getProperties();
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
    this.getProperties();
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
      pathname: '/properties',
      search: `?${this.getQueryParameters()}`,
    });
  }

  /**
   * Get a list of properties according to the search params
   * @return {JSX.Element}
   */
  getProperties = async () => {
    this.setState({loading: true, alert: null});
    this.updateUrl();

    const url = process.env.REACT_APP_API_URL +
        '/properties?' +
        this.getQueryParameters();

    const options = {
      method: 'GET',
      headers: {},
    };
    if (this.props.signedIn) {
      options.headers['x-access-token'] = localStorage.getItem('accessToken');
    }

    const response = await fetch(url, options);

    if (response.status === 200) {
      const json = await response.json();
      const searchParams = {...this.state.searchParams};
      searchParams.page = json.page;
      searchParams.resultsPerPage = json.resultsPerPage;
      this.setState({
        properties: json.properties,
        propertyCount: json.propertyCount,
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
   * Request new properties according to the requested page
   * and results per page
   * @param {number} page Selected page
   * @param {number} resultsPerPage Results per page
   */
  onPagination = (page, resultsPerPage) => {
    const searchParams = this.state.searchParams;
    searchParams.page = page;
    searchParams.resultsPerPage = resultsPerPage;
    this.setState({searchParams});
    this.getProperties();
  }

  /**
   * Render a pagination component
   * @return {JSX.Element}
   */
  pagination = () => {
    return (
      <Pagination
        total={this.state.propertyCount}
        showTotal={(total) => `Found ${total} properties`}
        current={this.state.searchParams.page}
        pageSize={this.state.searchParams.resultsPerPage}
        pageSizeOptions={pageSizeOptions}
        showSizeChanger
        onChange={this.onPagination}
      />
    );
  }

  /**
   * Render properties list
   * @return {JSX.Element}
   */
  render() {
    return (
      <Layout.Content className="content content-vertical">
        <PropertyFilter
          searchParams={this.state.searchParams}
          setSearchParams={this.setSearchParams}
          loading={this.state.loading}
          signedIn={this.props.signedIn} />
        {this.state.alert &&
          <Alert
            className="property-alert"
            message={this.state.alert.message}
            type={this.state.alert.type} />
        }
        <List
          className="property-list"
          itemLayout="vertical"
          loading={this.state.loading}
          header={this.pagination()}
          footer={this.pagination()}
          dataSource={this.state.properties}
          renderItem={(property) => (
            <PropertyTile property={property} />
          )} />
      </Layout.Content>
    );
  }
}

Properties.propTypes = {
  /** History from react-router */
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  /** Location from react-router */
  location: PropTypes.object,
  /** Whether the user is signed in or not */
  signedIn: PropTypes.bool.isRequired,
};

export default withRouter(Properties);
