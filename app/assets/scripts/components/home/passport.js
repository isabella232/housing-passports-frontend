'use strict';
import React from 'react';
import styled from 'styled-components';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';
import { themeVal } from '../../atomic-components/utils/functions';
import { divide } from '../../atomic-components/utils/math';

import { LoadingSkeleton, LoadingSkeletonGroup } from '../common/loading-skeleton';

class Passport extends React.Component {
  render () {
    if (!this.props.visible) return null;

    const { isReady, hasError, getData } = this.props.rooftop;
    const data = getData();

    return (
      <article className={this.props.className}>
        <PassportHeader>
          <PassportTitle onClick={() => this.setState({ galleryRevealed: true })}>Passport</PassportTitle>
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
      </article>
    );
  }
}

if (environment !== 'production') {
  Passport.propTypes = {
    className: T.string,
    rooftop: T.object,
    visible: T.bool
  };
}

export default styled(Passport)`
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

const VerticalDivider = styled.hr`
  border: 0;
  width: ${divide(themeVal('layout.globalSpacing'), 2)};
  height: ${themeVal('layout.globalSpacing')};
  margin: 0 ${divide(themeVal('layout.globalSpacing'), 4)};
  background: transparent linear-gradient(transparent, ${themeVal('colors.baseAlphaColor')}, transparent) 50% / auto ${themeVal('shape.borderWidth')} repeat-y;
`;
