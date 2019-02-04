'use strict';
import React from 'react';
import styled from 'styled-components';

import { themeVal } from '../atomic-components/utils/functions';

import Button from '../atomic-components/button';
import ButtonGroup from '../atomic-components/button-group';
import MapillaryView from '../components/mapillary';
import MapboxView from '../components/mapbox';

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

const PageBody = styled.main`
`;

const Vizualizations = styled.div`
  display: grid;
  height: 100%;

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

export default class Home extends React.Component {
  render () {
    return (
      <Page>
        <PageHeader>
          <PageTitle>Housing Passports <small>Colombia</small></PageTitle>
          <ButtonGroup orientation='horizontal'>
            <Button variation='base-raised-light' active>Split</Button>
            <Button variation='base-raised-light'>Street</Button>
            <Button variation='base-raised-light'>Overhead</Button>
          </ButtonGroup>
        </PageHeader>
        <PageBody>
          <Vizualizations>
            <StreetViz>
              <MapillaryView />
            </StreetViz>
            <OverheadViz>
              <MapboxView />
            </OverheadViz>
          </Vizualizations>
        </PageBody>
      </Page>
    );
  }
}
