'use strict';
import React from 'react';
import styled from 'styled-components';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';

import { environment } from '../config';
import { themeVal } from '../atomic-components/utils/functions';
import { divide } from '../atomic-components/utils/math';
import collecticon from '../atomic-components/collecticons';
import { wrapApiResult, getFromState } from '../utils/utils';

import Button from '../atomic-components/button';
import ButtonGroup from '../atomic-components/button-group';
import MapillaryView from '../components/mapillary';
import MapboxView from '../components/mapbox';
import { fetchRooftopCentroids, fetchRooftop } from '../redux/rooftops';
import { LoadingSkeleton, LoadingSkeletonGroup } from '../components/loading-skeleton';

const Page = styled.section`
  display: grid;
  min-height: 100vh;

  /* grid: [row1-start] "major minor" 4rem [row1-end] [row2-start] "major minor" auto [row2-end] / auto 20rem; */
  grid-auto-columns: 1fr 20rem;
  grid-auto-rows: auto 1fr;
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

const Passport = styled.article`
  grid-column: 2;
  grid-row: 1 / span 2;
  position: relative;
  z-index: 20;
  background: #fff;
  box-shadow: 0 0 0 1px ${themeVal('colors.baseAlphaColor')};
  overflow: hidden;
`;

const PassportHeader = styled.header`
  position: relative;
  z-index: 10;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  background: #fff;
  padding: ${themeVal('layout.globalSpacing')};
  box-shadow: 0 0 0 1px ${themeVal('colors.baseAlphaColor')};
  min-height: 4rem;
`;

const PassportTitle = styled.h1`
  font-family: ${themeVal('typography.headingFontFamily')};
  font-weight: ${themeVal('typography.headingFontWeight')};
  letter-spacing: 0.125em;
  font-size: 1rem;
  line-height: 1.25rem;
  text-transform: uppercase;
  color: ${themeVal('colors.primaryColor')};
  margin: 0;
`;

const PassportToolbar = styled.div`

`;

const HorizontalDivider = styled.hr`
  border: 0;
  height: ${divide(themeVal('layout.globalSpacing'), 2)};
  width: ${themeVal('layout.globalSpacing')};
  margin: ${divide(themeVal('layout.globalSpacing'), 4)} 0;
  background: transparent linear-gradient(transparent, ${themeVal('colors.baseAlphaColor')}, transparent) 50% / auto ${themeVal('shape.borderWidth')} repeat-x;
`;

const VerticalDivider = styled.hr`
  border: 0;
  width: ${divide(themeVal('layout.globalSpacing'), 2)};
  height: ${themeVal('layout.globalSpacing')};
  margin: 0 ${divide(themeVal('layout.globalSpacing'), 4)};
  background: transparent linear-gradient(transparent, ${themeVal('colors.baseAlphaColor')}, transparent) 50% / auto ${themeVal('shape.borderWidth')} repeat-y;
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
    this.onMapillaryMarkerClick = this.onMapillaryMarkerClick.bind(this);

    this.onMapboxFeatureHover = this.onMapboxFeatureHover.bind(this);
    this.onMapboxFeatureClick = this.onMapboxFeatureClick.bind(this);
  }

  componentDidMount () {
    this.props.fetchRooftopCentroids();

    const currId = this.props.match.params.rooftop;
    if (currId) {
      this.props.fetchRooftop(currId);
    }
  }

  componentDidUpdate (prevProps) {
    const currId = this.props.match.params.rooftop;
    const prevId = prevProps.match.params.rooftop;

    if (currId !== prevId) {
      this.props.fetchRooftop(currId);
    }
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

  onMapillaryMarkerClick (id) {
    this.props.history.push(`/passport/${id}`);
  }

  onMapboxFeatureClick (id) {
    this.props.history.push(`/passport/${id}`);
  }

  onVizViewClick (type) {
    this.setState({ vizView: type });
  }

  renderPassport () {
    const hasId = !!this.props.match.params.rooftop;
    const { isReady, hasError, getData } = this.props.rooftop;

    if (!hasId) return null;

    const data = getData();

    return (
      <Passport>
        <PassportHeader>
          <PassportTitle>Passport</PassportTitle>
          <PassportToolbar>
            <VerticalDivider />
          </PassportToolbar>
        </PassportHeader>

        {!isReady() && (
          <LoadingSkeletonGroup>
            <LoadingSkeleton type='heading' width={1 / 5}/>
            <LoadingSkeleton width={2 / 3} />
            <LoadingSkeleton width={2 / 3} />
            <LoadingSkeleton width={1 / 4} />
          </LoadingSkeletonGroup>
        )}

        {hasError() && (
          <p>Passport not found</p>
        )}

        {!hasError() && isReady() && (
          <pre>
            {JSON.stringify(data, null, '  ')}
          </pre>
        )}
      </Passport>
    );
  }

  render () {
    const rooftopParam = this.props.match.params.rooftop;
    const rooftopId = rooftopParam ? parseInt(rooftopParam) : null;

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
                markerPos={this.state.mapillaryPos}
                markerBearing={this.state.mapillaryBearing}
                onFeatureHover={this.onMapboxFeatureHover}
                onFeatureClick={this.onMapboxFeatureClick}
                highlightFeatureId={this.state.hoverFeatureId}
                selectedFeatureId={rooftopId}
              />
            </OverheadViz>
          )}
        </Visualizations>
        {this.renderPassport()}
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
    history: T.object
  };
}

function mapStateToProps (state, props) {
  return {
    rooftopCentroids: wrapApiResult(state.rooftops.centroids),
    rooftop: wrapApiResult(getFromState(state, ['rooftops', 'individualRooftops', props.match.params.rooftop]))
  };
}

function dispatcher (dispatch) {
  return {
    fetchRooftopCentroids: (...args) => dispatch(fetchRooftopCentroids(...args)),
    fetchRooftop: (...args) => dispatch(fetchRooftop(...args))
  };
}

export default connect(
  mapStateToProps,
  dispatcher
)(Home);
