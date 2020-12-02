import React from 'react';
import PropTypes from 'prop-types';

import {List, Typography, Image} from 'antd';
import {Link} from 'react-router-dom';
import moment from 'moment';

const priority = {
  normal: {
    image: {
      width: 250,
      height: 160,
    },
  },
  high: {
    image: {
      width: 350,
      height: 200,
    },
  },
};

/**
 * Converts specific camel-cased types to human readable strings
 * @param {string} type Camel-cased type
 * @return {string} Human readable type
 */
function typeFormatter(type) {
  if (type === 'semiDetached') {
    return 'Semi-detached';
  }
  if (type === 'endOfTerrace') {
    return 'End of terrace';
  }
  return type;
}

/**
 * Wraps the description at 100 characters and appends
 * triple dots.
 * @param {string} description Description
 * @return {string} Wrapped description
 */
function descriptionFormatter(description) {
  const wrapAt = 200;
  if (!description || description.length < wrapAt) {
    return description;
  }
  return `${description.substring(0, wrapAt)}...`;
}

/**
 * Formats the price by prepending a £ sign
 * and adding a thousand separator comma
 * @param {number} price Selected price
 * @return {string} Formatted price
 */
function priceFormatter(price) {
  const number = Number(price);
  if (isNaN(number) || number === 0) {
    return 'Contact seller for price';
  }
  return `£ ${price ? price : 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Get thumbnail for a property
 * @param {object[]} property Property
 * @return {JSX.Element} Thumbnail component
 */
function getThumbnail(property) {
  if (property.files && property.files.length !== 0) {
    const thumbnail = property.files
        .find((file) => file.type.startsWith('image'));

    if (thumbnail) {
      return (
        <Image
          className="image"
          {...priority[property.priority].image}
          src={`${process.env.REACT_APP_API_URL}/${thumbnail.fileLocation}`}
        />
      );
    }
  }
  return (null);
}

/**
 * Property tile component for displaying the most
 * important information about a property in a list
 * @param {object} props Component properties
 * @return {JSX.Element}
 */
function PropertyTile(props) {
  const {property} = props;
  return (
    <List.Item
      key={property._id}
      className={`property-list-item priority-${property.priority}`}
      extra={
        <>
          {getThumbnail(property)}
          <Typography.Title
            level={4}
            className={`price priority-${property.priority}`}>
            {priceFormatter(property.price)}
          </Typography.Title>
        </>
      }
    >
      <Link to={`/properties/${property._id}`}>
        <Typography.Title level={4} className="title">
          {property.title}
        </Typography.Title>
      </Link>

      <Typography.Paragraph className="type">
        {typeFormatter(property.type)}
        {property.priority === 'high' &&
          <Typography.Paragraph className="text-accent">
            High priority
          </Typography.Paragraph>
        }
      </Typography.Paragraph>

      <Typography.Paragraph type="secondary">
        {descriptionFormatter(property.description)}
      </Typography.Paragraph>

      <Typography.Text className="listed-time">
        Listed {moment(property.createdAt).fromNow()}
      </Typography.Text>
    </List.Item>
  );
}

PropertyTile.propTypes = {
  property: PropTypes.object.isRequired,
};

export default PropertyTile;
