'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import * as Mapillary from 'mapillary-js';
import styled, { withTheme } from 'styled-components';
import throttle from 'lodash.throttle';

import { mapillaryClientId, environment } from '../config';
import { visuallyHidden } from '../atomic-components/utils';

import AbsoluteContainer from '../atomic-components/absolute-container';

const MapillaryFigure = styled.figure`
  width: 100%;
  height: 100%;
  margin: 0;

  > figcaption {
    ${visuallyHidden()}
  }
`;

class MapillaryView extends React.PureComponent {
  constructor (props) {
    super(props);

    this.markersSetupDone = false;

    this.onBearingChangeDebounced = throttle(
      bearing => this.props.onBearingChange(bearing),
      250
    );
  }

  componentDidMount () {
    const mlyConfig = {
      component: {
        cover: false,
        marker: {
          visibleBBoxSize: 50
        }
      }
    };

    this.mly = new Mapillary.Viewer(
      'mapillary-container',
      mapillaryClientId,
      null,
      mlyConfig
    );

    this.mly.moveCloseTo(4.549837141933978, -74.16000750189613);

    // Update coordinates when the user navigates.
    this.mly.on(Mapillary.Viewer.nodechanged, node =>
      this.props.onCoordinatesChange([node.latLon.lon, node.latLon.lat])
    );

    // Update the bearing on rotation.
    this.mly.on(Mapillary.Viewer.bearingchanged, this.onBearingChangeDebounced);

    // Highlight the marker on mouse move.
    this.mly.on('mousemove', async e => {
      const marker = await this.mly
        .getComponent('marker')
        .getMarkerIdAt(e.pixelPoint);
      const id = marker ? parseInt(marker.split('-')[1]) : null;

      if (id !== this.props.highlightMarkerId) this.props.onMarkerHover(id);
    });

    this.setupMarkers(this.props);
  }

  componentDidUpdate (prevProps) {
    this.setupMarkers(this.props);

    // Highlight the marker.
    // De-highlight the previous one.
    const hl = this.props.highlightMarkerId;
    const prevHl = prevProps.highlightMarkerId;
    if (hl !== prevHl) {
      const markerComponent = this.mly.getComponent('marker');
      let markers = [];
      if (prevHl !== null) {
        markers.push(
          this.createMarker(
            prevHl,
            markerComponent.get(`rooftop-${prevHl}`).latLon,
            false
          )
        );
      }
      if (hl !== null) {
        markers.push(
          this.createMarker(hl, markerComponent.get(`rooftop-${hl}`).latLon, true)
        );
      }
      markerComponent.add(markers);
    }
  }

  /**
   * Create a mapillary marker
   *
   * @param {number} id Marker numeric index
   * @param {object} coords Coordinates { lon, lat }
   * @param {boolean} hover Whether or not the marker is hovered.
   */
  createMarker (id, coords, hover) {
    const { primaryColor, secondaryColor } = this.props.theme.colors;
    const markerColor = hover ? primaryColor : secondaryColor;
    return new Mapillary.MarkerComponent.SimpleMarker(`rooftop-${id}`, coords, {
      interactive: true,
      color: markerColor
    });
  }

  setupMarkers (props) {
    const { rooftopCentroids } = props;
    if (this.markersSetupDone || !rooftopCentroids) return;

    const markers = rooftopCentroids.map(element => {
      const [lon, lat] = element.coords;
      return this.createMarker(
        element.id,
        { lon, lat },
        this.props.highlightMarkerId === element.id
      );
    });

    this.mly.getComponent('marker').add(markers);

    this.markersSetupDone = true;
  }

  render () {
    return (
      <MapillaryFigure>
        <AbsoluteContainer id='mapillary-container' />
        <figcaption>Street view</figcaption>
      </MapillaryFigure>
    );
  }
}

export default withTheme(MapillaryView);

if (environment !== 'production') {
  MapillaryView.propTypes = {
    theme: T.object,
    onCoordinatesChange: T.func,
    onBearingChange: T.func,
    onMarkerHover: T.func,
    rooftopCentroids: T.array,
    highlightMarkerId: T.number
  };
}
