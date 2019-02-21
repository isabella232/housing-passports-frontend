'use strict';
import React from 'react';
import styled from 'styled-components';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import qs from 'qs';

import { environment } from '../config';
import { themeVal } from '../atomic-components/utils/functions';
import collecticon from '../atomic-components/collecticons';
import { wrapApiResult, getFromState } from '../utils/utils';

import Button from '../atomic-components/button';
import ButtonGroup from '../atomic-components/button-group';
import MapillaryView from '../components/home/mapillary';
import MapboxView from '../components/home/mapbox';
import { fetchRooftopCentroids, fetchRooftop } from '../redux/rooftops';
import Passport from '../components/home/passport';

const Page = styled.section`
  display: grid;
  height: 100vh;
  grid-template-rows: auto;
  grid-auto-rows: 1fr;
  grid-template-columns: 1fr;
  grid-auto-columns: 20rem;
`;

const PageHeader = styled.header`
  grid-column: 1;
  position: relative;
  z-index: 10;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  background: #fff;
  padding: ${themeVal('layout.globalSpacing')};
  box-shadow: 0 0 0 1px ${themeVal('colors.baseAlphaColor')};
  min-height: 4rem;

  > *:last-child {
    margin-left: auto;
  }
`;

const PageTitle = styled.h1`
  font-family: ${themeVal('typography.headingFontFamily')};
  font-weight: ${themeVal('typography.headingFontWeight')};
  letter-spacing: 0.125em;
  font-size: 1.125rem;
  line-height: 1.25rem;
  text-transform: uppercase;
  color: ${themeVal('colors.primaryColor')};
  margin: 0;

  small {
    font-weight: ${themeVal('typography.headingFontRegular')};
    line-height: inherit;
    font-size: 0.875rem;
    color: ${themeVal('typography.baseFontColor')};
    opacity: 0.48;
    margin-left: 0.5rem;
    padding-left: 0.5rem;
    box-shadow: -1px 0 0 0 ${themeVal('colors.baseAlphaColor')};
  }
`;

const ButtonSplitViz = styled(Button)`
  ::before {
    ${collecticon('layout-row-2x')}
  }
`;

const ButtonStreetViz = styled(Button)`
  ::before {
    ${collecticon('road')}
  }
`;

const ButtonOverheadViz = styled(Button)`
  ::before {
    ${collecticon('map')}
  }
`;

const Visualizations = styled.main`
  grid-column: 1;
  display: grid;

  /* stylelint-disable-next-line */
  > * {
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 1px 0 0 ${themeVal('colors.baseAlphaColor')};
  }
`;

const StreetViz = styled.section`
  position: relative;
  grid-row: auto / span 1;
`;

const OverheadViz = styled.section`
  position: relative;
  grid-row: auto / span 1;
`;

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      mapView: this.getQSCoords(props),
      mapillaryBearing: 0,

      hoverFeatureId: null,

      vizView: 'split',

      // Explanation on centerKey.
      // There are some occasions (recenter button and selecting a passport)
      // that should trigger a map recenter. To keep this controlled through
      // props we change the center key which triggers a render.
      centerKey: 1
    };

    this.onMapillaryCoordsChange = this.onMapillaryCoordsChange.bind(this);
    this.onMapillaryBearingChange = this.onMapillaryBearingChange.bind(this);
    this.onMapillaryMarkerHover = this.onMapillaryMarkerHover.bind(this);
    this.onMapillaryMarkerClick = this.onMapillaryMarkerClick.bind(this);

    this.onMapboxFeatureHover = this.onMapboxFeatureHover.bind(this);
    this.onMapboxFeatureClick = this.onMapboxFeatureClick.bind(this);
    this.onMapboxZoom = this.onMapboxZoom.bind(this);

    this.onRecenterClick = this.onRecenterClick.bind(this);
  }

  componentDidMount () {
    this.props.fetchRooftopCentroids();

    const currId = this.props.match.params.rooftop;
    if (currId) {
      this.props.fetchRooftop(currId);
    }
  }

  async componentDidUpdate (prevProps) {
    const currId = this.props.match.params.rooftop;
    const prevId = prevProps.match.params.rooftop;

    if (currId && currId !== prevId) {
      await this.props.fetchRooftop(currId);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ centerKey: Date.now() });
    }
  }

  getQSCoords (props) {
    const defVals = {
      lat: 4.5481,
      lon: -74.1613,
      zoom: 16
    };

    const qsParams = qs.parse(props.location.search.substr(1));
    if (!qsParams.map) return defVals;

    const vals = qsParams.map.split(',').map(parseFloat);
    if (vals.length !== 3 || vals.some(isNaN)) return defVals;

    const [lon, lat, zoom] = vals;
    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) return defVals;

    return { lon, lat, zoom };
  }

  onMapillaryCoordsChange ([lon, lat]) {
    this.setState({
      mapView: {
        ...this.state.mapView,
        lon,
        lat
      }
    });

    this.props.history.push({
      search: `map=${lon},${lat},${this.state.mapView.zoom}`
    });
  }

  onMapillaryBearingChange (bearing) {
    this.setState({ mapillaryBearing: bearing });
  }

  onMapillaryMarkerHover (id) {
    this.setState({ hoverFeatureId: id });
  }

  onMapboxFeatureHover (id) {
    this.setState({ hoverFeatureId: id });
  }

  onMapillaryMarkerClick (id) {
    this.props.history.push({
      pathname: `/passport/${id}`,
      search: this.props.location.search
    });
  }

  onMapboxFeatureClick (id) {
    this.props.history.push({
      pathname: `/passport/${id}`,
      search: this.props.location.search
    });
  }

  onMapboxZoom (zoom) {
    this.setState({
      mapView: {
        ...this.state.mapView,
        zoom
      }
    });

    this.props.history.push({
      search: `map=${this.state.mapView.lon},${this.state.mapView.lat},${zoom}`
    });
  }

  onVizViewClick (type) {
    this.setState({ vizView: type });
  }

  onRecenterClick () {
    this.setState({ centerKey: Date.now() });
  }

  render () {
    const rooftopParam = this.props.match.params.rooftop;
    const rooftopId = rooftopParam ? parseInt(rooftopParam) : null;

    let rooftopCoords = null;
    if (rooftopId !== null) {
      const centroid = this.props.rooftopCentroids.getData()[rooftopId];
      if (centroid) {
        rooftopCoords = centroid.coords;
      }
    }

    return (
      <Page>
        <PageHeader>
          <PageTitle>
            Housing Passports <small>Colombia</small>
          </PageTitle>
          <ButtonGroup orientation='horizontal'>
            <ButtonSplitViz
              variation='base-raised-light'
              hideText
              title='Change to split view'
              active={this.state.vizView === 'split'}
              onClick={this.onVizViewClick.bind(this, 'split')}
            >
              Split
            </ButtonSplitViz>
            <ButtonStreetViz
              variation='base-raised-light'
              hideText
              title='Change to street view'
              active={this.state.vizView === 'street'}
              onClick={this.onVizViewClick.bind(this, 'street')}
            >
              Street
            </ButtonStreetViz>
            <ButtonOverheadViz
              variation='base-raised-light'
              hideText
              title='Change to overhead view'
              active={this.state.vizView === 'overhead'}
              onClick={this.onVizViewClick.bind(this, 'overhead')}
            >
              Overhead
            </ButtonOverheadViz>
          </ButtonGroup>
        </PageHeader>
        <Visualizations>
          {this.state.vizView !== 'overhead' && (
            <StreetViz>
              <MapillaryView
                vizView={this.state.vizView}
                coordinates={[this.state.mapView.lon, this.state.mapView.lat]}
                rooftopCoords={rooftopCoords}
                centerKey={this.state.centerKey}
                rooftopCentroids={this.props.rooftopCentroids.getData(null)}
                onCoordinatesChange={this.onMapillaryCoordsChange}
                onBearingChange={this.onMapillaryBearingChange}
                onMarkerHover={this.onMapillaryMarkerHover}
                onMarkerClick={this.onMapillaryMarkerClick}
                highlightMarkerId={this.state.hoverFeatureId}
                selectedMarkerId={rooftopId}
              />
            </StreetViz>
          )}

          {this.state.vizView !== 'street' && (
            <OverheadViz>
              <MapboxView
                vizView={this.state.vizView}
                rooftopCoords={rooftopCoords}
                centerKey={this.state.centerKey}
                zoom={this.state.mapView.zoom}
                markerPos={[this.state.mapView.lon, this.state.mapView.lat]}
                markerBearing={this.state.mapillaryBearing}
                onFeatureHover={this.onMapboxFeatureHover}
                onFeatureClick={this.onMapboxFeatureClick}
                onZoom={this.onMapboxZoom}
                highlightFeatureId={this.state.hoverFeatureId}
                selectedFeatureId={rooftopId}
              />
            </OverheadViz>
          )}
        </Visualizations>

        <Passport
          onRecenterClick={this.onRecenterClick}
          visible={!!this.props.match.params.rooftop}
          rooftop={this.props.rooftop}
          rooftopCoords={rooftopCoords}
          searchQS={this.props.location.search}
        />
      </Page>
    );
  }
}

if (environment !== 'production') {
  Home.propTypes = {
    fetchRooftopCentroids: T.func,
    fetchRooftop: T.func,
    rooftopCentroids: T.object,
    rooftop: T.object,
    match: T.object,
    location: T.object,
    history: T.object
  };
}

function mapStateToProps (state, props) {
  return {
    rooftopCentroids: wrapApiResult(state.rooftops.centroids),
    rooftop: wrapApiResult(
      getFromState(state, [
        'rooftops',
        'individualRooftops',
        props.match.params.rooftop
      ])
    )
  };
}

function dispatcher (dispatch) {
  return {
    fetchRooftopCentroids: (...args) =>
      dispatch(fetchRooftopCentroids(...args)),
    fetchRooftop: (...args) => dispatch(fetchRooftop(...args))
  };
}

export default connect(
  mapStateToProps,
  dispatcher
)(Home);
