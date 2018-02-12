import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6

import {
  View,
} from 'native-base';

import SvgUri from '../../lib/react-native-svg-uri/index';
import svgs from '../assets/svgs';

export default class Svg extends Component {
  render() {
    const svgXmlData = svgs[this.props.icon];

    if (!svgXmlData) {
      return (
        <View/>
      );
    }
    return (
      <SvgUri
        width={this.props.size}
        height={this.props.size}
        svgXmlData={svgXmlData}
        fill={this.props.color}
        style={this.props.style}
      />
    );
  }
}

Svg.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  style: PropTypes.string,
};

Svg.defaultProps = {
  icon: '',
  color: '',
  size: '',
  style: '',
};
