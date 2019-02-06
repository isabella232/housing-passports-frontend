'use strict';
import React from 'react';
import styled from 'styled-components';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';

import { environment } from '../config';
import { themeVal } from '../atomic-components/utils/functions';
import collecticon from '../atomic-components/collecticons';
import { wrapApiResult } from '../utils/utils';

import Button from '../atomic-components/button';
import ButtonGroup from '../atomic-components/button-group';
import MapillaryView from '../components/mapillary';
import MapboxView from '../components/mapbox';
import { fetchRooftopCentroids } from '../redux/rooftops';

const Page = styled.section`
  display: grid;
  min-height: 100vh;
  grid: [row1-start] "major minor" 4rem [row1-end] [row2-start] "major minor" auto [row2-end] / auto 20rem;
`;

const PageHeader = styled.header`
  grid-area: major;
  position: relative;
  z-index: 10;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: 4rem;
  background: #fff;
  padding: ${themeVal('layout.globalSpacing')};
  box-shadow: 0 0 0 1px ${themeVal('colors.baseAlphaColor')};

  > *:last-child {
    margin-left: auto;
  }
`;

const Visualizations = styled.main`
  grid-area: major;
  display: grid;

  /* stylelint-disable-next-line */
  > * {
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 1px 0 0 ${themeVal('colors.baseAlphaColor')};
  }
`;

const Passport = styled.article`
  grid-area: minor;
  position: relative;
  z-index: 20;
  background: #fff;
  padding: ${themeVal('layout.globalSpacing')};
  box-shadow: 0 0 0 1px ${themeVal('colors.baseAlphaColor')};
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
      mapillaryPos: [-74.1613, 4.5481],
      mapillaryBearing: 0,

      hoverFeatureId: null,

      vizView: 'split'
    };

    this.onMapillaryCoordsChange = this.onMapillaryCoordsChange.bind(this);
    this.onMapillaryBearingChange = this.onMapillaryBearingChange.bind(this);
    this.onMapillaryMarkerHover = this.onMapillaryMarkerHover.bind(this);

    this.onMapboxFeatureHover = this.onMapboxFeatureHover.bind(this);
  }

  componentDidMount () {
    this.props.fetchRooftopCentroids();
  }

  onMapillaryCoordsChange (lnglat) {
    this.setState({ mapillaryPos: lnglat });
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

  onVizViewClick (type) {
    this.setState({ vizView: type });
  }

  render () {
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
                rooftopCentroids={this.props.rooftopCentroids.getData(null)}
                onCoordinatesChange={this.onMapillaryCoordsChange}
                onBearingChange={this.onMapillaryBearingChange}
                onMarkerHover={this.onMapillaryMarkerHover}
                highlightMarkerId={this.state.hoverFeatureId}
              />
            </StreetViz>
          )}

          {this.state.vizView !== 'street' && (
            <OverheadViz>
              <MapboxView
                vizView={this.state.vizView}
                markerPos={this.state.mapillaryPos}
                markerBearing={this.state.mapillaryBearing}
                onFeatureHover={this.onMapboxFeatureHover}
                highlightFeatureId={this.state.hoverFeatureId}
              />
            </OverheadViz>
          )}
        </Visualizations>
        <Passport>

        </Passport>
      </Page>
    );
  }
}

if (environment !== 'production') {
  Home.propTypes = {
    fetchRooftopCentroids: T.func,
    rooftopCentroids: T.object
  };
}

function mapStateToProps (state) {
  return {
    rooftopCentroids: wrapApiResult(state.rooftops.centroids)
  };
}

function dispatcher (dispatch) {
  return {
    fetchRooftopCentroids: (...args) => dispatch(fetchRooftopCentroids(...args))
  };
}

export default connect(
  mapStateToProps,
  dispatcher
)(Home);
