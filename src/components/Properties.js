import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Content.less';
import {withRouter} from 'react-router-dom';
import {Layout, List, Pagination} from 'antd';
import PropertyTile from './PropertyTile';

/**
 * Properties component, that lists properties according to the selected filters
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
      properties: [],
      pageCount: 0,
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
   * Builds a list of property tiles according to the
   * filter and sort criteria
   * @return {JSX.Element}
   */
  getProperties = async () => {
    this.setState({loading: true});
    this.updateUrl();

    const url = process.env.REACT_APP_API_URL +
        '/properties?' +
        this.getQueryParameters();

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, options);

    this.setState({loading: false});
    if (response.status === 200) {
      const json = await response.json();
      const searchParams = this.state.searchParams;
      searchParams.page = json.page;
      searchParams.resultsPerPage = json.resultsPerPage;
      this.setState({
        properties: json.properties,
        pageCount: json.pageCount,
        propertyCount: json.propertyCount,
        searchParams,
      });
      console.log(this.state.searchParams);
    } else {
      console.log(await response.text());
    }
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
        showSizeChanger
        onChange={this.onPagination}
        onShowSizeChange={this.onPagination}
      />
    );
  }

  /**
   * Render properties list
   * @return {JSX.Element}
   */
  render() {
    return (
      <Layout.Content className="content">
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
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  location: PropTypes.object,
};

export default withRouter(Properties);
