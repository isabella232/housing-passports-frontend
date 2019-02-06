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
  grid-template-rows: auto 1fr;
`;

const PageHeader = styled.header`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: ${themeVal('layout.globalSpacing')};
  box-shadow: 0 0 16px 4px ${themeVal('colors.baseAlphaColor')};

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

const Visualizations = styled.div`
  display: grid;
  height: 100%;

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
  grid-row: 2 / span 1;
`;

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      mapillaryPos: [-74.1613, 4.5481],
      mapillaryBearing: 0,

      hoverFeatureId: null
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

  render () {
    return (
      <Page>
        <PageHeader>
          <PageTitle>Housing Passports <small>Colombia</small></PageTitle>
          <ButtonGroup orientation='horizontal'>
            <ButtonSplitViz variation='base-raised-light' hideText active>Split</ButtonSplitViz>
            <ButtonStreetViz variation='base-raised-light' hideText>Street</ButtonStreetViz>
            <ButtonOverheadViz variation='base-raised-light' hideText>Overhead</ButtonOverheadViz>
          </ButtonGroup>
        </PageHeader>
        <main>
          <Visualizations>
            <StreetViz>
              <MapillaryView
                rooftopCentroids={this.props.rooftopCentroids.getData(null)}
                onCoordinatesChange={this.onMapillaryCoordsChange}
                onBearingChange={this.onMapillaryBearingChange}
                onMarkerHover={this.onMapillaryMarkerHover}
                highlightMarkerId={this.state.hoverFeatureId}
              />
            </StreetViz>
            <OverheadViz>
              <MapboxView
                markerPos={this.state.mapillaryPos}
                markerBearing={this.state.mapillaryBearing}
                onFeatureHover={this.onMapboxFeatureHover}
                highlightFeatureId={this.state.hoverFeatureId}
              />
            </OverheadViz>
          </Visualizations>
        </main>
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

export default connect(mapStateToProps, dispatcher)(Home);
