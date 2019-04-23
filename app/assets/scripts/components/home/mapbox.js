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
import { lighten, rgba } from 'polished';

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

const mapLayers = [
  {
    id: 'mapbox-satellite',
    label: 'Mapbox Satellite',
    initial: false
  },
  {
    id: 'mapbox-drone',
    label: 'Drone Imagery',
    initial: false
  }
];

class MapboxView extends React.PureComponent {
  constructor (props) {
    super(props);

    // Possible map states.
    // 0 - not loaded
    // 1 - loaded, ready to style
    // 2 - layers added.
    this.mapState = 0;

    this.state = {
      layersState: mapLayers.map(v => v.initial)
    };

    this.handleLayerChange = this.handleLayerChange.bind(this);
  }

  componentDidMount () {
    this.initMap();
  }

  componentDidUpdate (prevProps, prevState) {
    this.layerDropdownControl.render(this.props, this.state);

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
        'all',
        ['==', 'id', hl === null ? '' : hl],
        ['has', 'material_ml']
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

    // Fly to location if rooftopCoords was updated.
    // This key is used to trigger an update in certain situations.
    // This is only used when a new rooftop gets selected.
    if (
      this.props.rooftopCoords &&
      this.props.centerKey !== prevProps.centerKey
    ) {
      this.map.flyTo({ center: this.props.rooftopCoords, zoom: 18 });
    }

    // Update maplayers if changed.
    if (prevState.layersState !== this.state.layersState) {
      mapLayers.forEach((layer, idx) => {
        this.map.setLayoutProperty(
          layer.id,
          'visibility',
          this.state.layersState[idx] ? 'visible' : 'none'
        );
      });
    }
  }

  handleLayerChange (layerIdx) {
    this.setState({
      // Replace the array index with the negated value.
      layersState: Object.assign([], this.state.layersState, {
        [layerIdx]: !this.state.layersState[layerIdx]
      })
    });
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
      logoPosition: 'bottom-left'
    });

    // Disable map rotation using right click + drag.
    this.map.dragRotate.disable();

    // Disable map rotation using touch rotation gesture.
    this.map.touchZoomRotate.disableRotation();

    // Disable scroll zoom
    this.map.scrollZoom.disable();

    // Add zoom controls.
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    this.layerDropdownControl = new MapboxControl((props, state) => (
      <ThemeProvider theme={props.theme}>
        <LayerControlDropdown
          layersConfig={mapLayers}
          layersState={state.layersState}
          handleLayerChange={this.handleLayerChange}
        />
      </ThemeProvider>
    ));

    this.map.addControl(this.layerDropdownControl, 'bottom-right');

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
        if (!features.length) return null;
        // Only return a feature if it has ml data.
        return features[0].properties.material_ml
          ? features[0].properties.id
          : null;
      };

      const mouseMoveDebounced = throttle(e => {
        const id = getFeatIdAtPoint(e.point);
        if (id !== this.props.highlightFeatureId) this.props.onFeatureHover(id);
      }, 100);

      this.map.on('mousemove', mouseMoveDebounced);

      this.map.on('click', e => {
        const id = getFeatIdAtPoint(e.point);
        if (id !== null && id !== this.props.selectedFeatureId) {
          this.props.onFeatureClick(id);
        }
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

    // Add toggable layers.
    // Mapbox
    const satLayerIdx = mapLayers.findIndex(o => o.id === 'mapbox-satellite');
    this.map.addSource('mapbox-satellite', {
      type: 'raster',
      url: 'mapbox://mapbox.satellite'
    });
    this.map.addLayer({
      id: 'mapbox-satellite',
      type: 'raster',
      source: 'mapbox-satellite',
      layout: {
        visibility: this.state.layersState[satLayerIdx] ? 'visible' : 'none'
      }
    });

    // Add toggable layers.
    // Drone
    const droneLayerIdx = mapLayers.findIndex(o => o.id === 'mapbox-drone');
    this.map.addSource('mapbox-drone', {
      type: 'raster',
      url: 'mapbox://devseed.bi28yjei'
    });
    this.map.addLayer({
      id: 'mapbox-drone',
      type: 'raster',
      source: 'mapbox-drone',
      layout: {
        visibility: this.state.layersState[droneLayerIdx] ? 'visible' : 'none'
      }
    });

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
        // 'fill-color': props.theme.colors.secondaryColor
        'fill-color': [
          'case',
          ['has', 'material_ml'],
          props.theme.colors.secondaryColor,
          rgba(props.theme.colors.secondaryColor, 0.32)
        ]
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
      filter: [
        'all',
        ['==', 'id', hl === null ? '' : hl],
        ['has', 'material_ml']
      ]
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
    centerKey: T.number,
    rooftopCoords: T.array,
    onFeatureHover: T.func,
    onFeatureClick: T.func,
    onZoom: T.func,
    markerPos: T.array,
    markerBearing: T.number,
    highlightFeatureId: T.number,
    selectedFeatureId: T.number
  };
}
