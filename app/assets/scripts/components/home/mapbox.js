'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import mapboxgl from 'mapbox-gl';
import throttle from 'lodash.throttle';
import styled, {
  createGlobalStyle,
  withTheme,
  ThemeProvider
} from 'styled-components';

import { mbtoken, environment } from '../../config';
import { visuallyHidden } from '../../atomic-components/utils';
import AbsoluteContainer from '../../atomic-components/absolute-container';
import MapboxControl from '../common/mapbox-react-control';
import LayerControlDropdown from './map-layer-control';
import collecticon from '../../atomic-components/collecticons';
import { lighten } from 'polished';

// set once
mapboxgl.accessToken = mbtoken;

const MarkerStyle = createGlobalStyle`
  .marker-mapillary-position {
    width: 1.5rem;
    height: 1.5rem;

    &::before {
      ${collecticon('compass-2')}
      display: block;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      transform: ${({ markerBearing }) => `rotate(${markerBearing - 45}deg)`};
    }
  }
`;

const MapboxFigure = styled.figure`
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;

  > figcaption {
    ${visuallyHidden()}
  }
`;

class MapboxView extends React.PureComponent {
  constructor (props) {
    super(props);

    // Possible map states.
    // 0 - not loaded
    // 1 - loaded, ready to style
    // 2 - layers added.
    this.mapState = 0;
  }

  componentDidMount () {
    this.initMap();
  }

  componentDidUpdate (prevProps) {
    // When the view changes or when a feature is selected / de-selected
    // resize the map.
    if (
      this.props.vizView !== prevProps.vizView ||
      prevProps.selectedFeatureId === null ||
      this.props.selectedFeatureId === null
    ) {
      this.map.resize();
    }

    if (this.mapillaryPositionMarker) {
      this.mapillaryPositionMarker.setLngLat(this.props.markerPos);
    }

    const hl = this.props.highlightFeatureId;
    if (hl !== prevProps.highlightFeatureId && this.mapState >= 2) {
      this.map.setFilter('rooftop-highlight', [
        '==',
        'id',
        hl === null ? '' : hl
      ]);
    }

    const sel = this.props.selectedFeatureId;
    if (sel !== prevProps.selectedFeatureId && this.mapState >= 2) {
      this.map.setFilter('rooftop-selected', [
        '==',
        'id',
        sel === null ? '' : sel
      ]);
    }
  }

  initMap () {
    this.map = new mapboxgl.Map({
      center: this.props.markerPos,
      container: this.refs.mapEl,
      style: 'mapbox://styles/mapbox/light-v9',
      zoom: this.props.zoom,
      pitchWithRotate: false,
      renderWorldCopies: false,
      dragRotate: false,
      logoPosition: 'bottom-right'
    });

    // Disable map rotation using right click + drag.
    this.map.dragRotate.disable();

    // Disable map rotation using touch rotation gesture.
    this.map.touchZoomRotate.disableRotation();

    // Disable scroll zoom
    this.map.scrollZoom.disable();

    // Add zoom controls.
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

    this.layerDropdownControl = new MapboxControl(props => (
      <ThemeProvider theme={props.theme}>
        <LayerControlDropdown />
      </ThemeProvider>
    ));

    this.map.addControl(this.layerDropdownControl, 'bottom-left');

    // Initial rendering.
    this.layerDropdownControl.render(this.props, this.state);

    // Remove compass.
    document.querySelector('.mapboxgl-ctrl .mapboxgl-ctrl-compass').remove();

    this.map.on('load', () => {
      this.mapState = 1;
      this.initMapStyle(this.props);

      const getFeatIdAtPoint = point => {
        const features = this.map.queryRenderedFeatures(point, {
          layers: ['rooftops']
        });
        return features.length ? features[0].properties.id : null;
      };

      const mouseMoveDebounced = throttle(e => {
        const id = getFeatIdAtPoint(e.point);
        if (id !== this.props.highlightFeatureId) this.props.onFeatureHover(id);
      }, 100);

      this.map.on('mousemove', mouseMoveDebounced);

      this.map.on('click', e => {
        const id = getFeatIdAtPoint(e.point);
        if (id !== null && id !== this.props.selectedFeatureId) { this.props.onFeatureClick(id); }
      });

      this.map.on('zoomend', () => {
        this.props.onZoom(this.map.getZoom());
      });
    });
  }

  initMapStyle (props) {
    if (!this.mapState || this.map.getSource('housing-passports-rooftops')) {
      return;
    }

    this.map.addSource('housing-passports-rooftops', {
      type: 'vector',
      url: 'mapbox://devseed.7azoc4fs'
    });

    const marker = document.createElement('div');
    marker.className = 'marker-mapillary-position';

    this.mapillaryPositionMarker = new mapboxgl.Marker(marker)
      .setLngLat(props.markerPos)
      .addTo(this.map);

    this.map.addLayer({
      id: 'rooftops',
      source: 'housing-passports-rooftops',
      'source-layer': 'rooftops',
      type: 'fill',
      paint: {
        'fill-color': props.theme.colors.secondaryColor
      }
    });

    const hl = props.highlightFeatureId;
    this.map.addLayer({
      id: 'rooftop-highlight',
      source: 'housing-passports-rooftops',
      'source-layer': 'rooftops',
      type: 'fill',
      paint: {
        'fill-color': lighten(0.2, props.theme.colors.primaryColor)
      },
      filter: ['==', 'id', hl === null ? '' : hl]
    });

    const sel = props.selectedFeatureId;
    this.map.addLayer({
      id: 'rooftop-selected',
      source: 'housing-passports-rooftops',
      'source-layer': 'rooftops',
      type: 'fill',
      paint: {
        'fill-color': props.theme.colors.primaryColor
      },
      filter: ['==', 'id', sel === null ? '' : sel]
    });

    // Map fully setup.
    this.mapState = 2;
  }

  render () {
    return (
      <MapboxFigure>
        <MarkerStyle markerBearing={this.props.markerBearing} />
        <AbsoluteContainer ref='mapEl' />
        <figcaption>Map</figcaption>
      </MapboxFigure>
    );
  }
}

export default withTheme(MapboxView);

if (environment !== 'production') {
  MapboxView.propTypes = {
    theme: T.object,
    vizView: T.string,
    zoom: T.number,
    onFeatureHover: T.func,
    onFeatureClick: T.func,
    onZoom: T.func,
    markerPos: T.array,
    markerBearing: T.number,
    highlightFeatureId: T.number,
    selectedFeatureId: T.number
  };
}
