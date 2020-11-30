import React from 'react';
import PropTypes from 'prop-types';

import '../styles/Carousel.less';
import {Carousel} from 'antd';
import {LeftOutlined, RightOutlined} from '@ant-design/icons';

/**
 * Next arrow for carousel
 * @param {object} props Component properties
 * @return {JSX.Element}
 */
function NextArrow(props) {
  const {className, style, onClick} = props;
  return (
    <div
      className={`carousel-arrow ${className}`}
      style={{...style}}
      onClick={onClick}
    >
      <RightOutlined />
    </div>
  );
};


NextArrow.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

/**
   * Previous arrow for carousel
   * @param {object} props Component properties
   * @return {JSX.Element}
   */
function PrevArrow(props) {
  const {className, style, onClick} = props;
  return (
    <div
      className={`${className} carousel-arrow`}
      style={{...style}}
      onClick={onClick}
    >
      <LeftOutlined />
    </div>
  );
};

PrevArrow.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

/**
 * Ant Desgin Carousel wrapper to add next and previous buttons
 * @param {JSX.Element[]} children Children to render in carousel
 * @return {JSX.Element}
 */
function CarouselWrapper({children}) {
  return (
    <Carousel
      arrows
      nextArrow={<NextArrow />}
      prevArrow={<PrevArrow />}>
      {children}
    </Carousel>
  );
}

CarouselWrapper.propTypes = {
  children: PropTypes.array.isRequired,
};

export default CarouselWrapper;
