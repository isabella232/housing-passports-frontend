'use strict';
import React from 'react';
import * as Mapillary from 'mapillary-js';
import styled, { createGlobalStyle } from 'styled-components';

import mapilaryStyle from '../vendor/mapillary';
import { visuallyHidden } from '../atomic-components/utils';
import AbsoluteContainer from '../atomic-components/absolute-container';

const MapillaryStyle = createGlobalStyle` ${mapilaryStyle()} `;

const MapillaryFigure = styled.figure`
  width: 100%;
  height: 100%;
  margin: 0;

  > figcaption {
    ${visuallyHidden()}
  }
`;

export default class MapillaryView extends React.Component {
  componentDidMount () {
    this.mly = new Mapillary.Viewer(
      'mapillary-container',
      // Replace this with your own client ID from mapillary.com
      'dl9BZmdSdlpKSXlFRmVfZVp0MDh1UTo2ZTE2MmJiMjE4OGI5NTZm',
      '6ZcXjb82YuNEtPNA3fqBzA');
  }

  render () {
    return (
      <MapillaryFigure>
        <MapillaryStyle />
        <AbsoluteContainer id='mapillary-container' />
        <figcaption>Street view</figcaption>
      </MapillaryFigure>
    );
  }
}
