'use strict';
import React from 'react';
import styled from 'styled-components';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';
import { themeVal } from '../../atomic-components/utils/functions';
import { divide } from '../../atomic-components/utils/math';

import { LoadingSkeleton, LoadingSkeletonGroup } from '../common/loading-skeleton';
import CarouselModal from './carousel-modal';
import Heading from '../../atomic-components/heading';
import Dl from '../../atomic-components/definition-list';

const PassportSection = styled.section`
  padding: ${themeVal('layout.globalSpacing')};

  &:not(:last-child) {
    box-shadow: 0 1px 0 0 ${themeVal('colors.baseAlphaColor')};
  }

  > *:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeading = styled(Heading)`
  margin: 0 0 1.5rem 0;
`;

const SectionDl = styled(Dl)`
  dt,
  dd {
    font-size: 0.75rem;
    line-height: 1rem;
  }

  dd {
    font-weight: ${themeVal('typography.baseFontBold')};
  }
`;

class Passport extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      galleryRevealed: false
    };

    this.onModalCloseClick = this.onModalCloseClick.bind(this);
  }

  onModalCloseClick () {
    this.setState({ galleryRevealed: false });
  }

  renderData () {
    const data = this.props.rooftop.getData();

    return (
      <div>
        <PassportSection>
          <SectionHeading variation='secondary' size='small'>Location</SectionHeading>
          <SectionDl type='horizontal'>
            <dt>Term</dt>
            <dd>Definition</dd>
            <dt>Term</dt>
            <dd>Definition</dd>
          </SectionDl>
        </PassportSection>
        <PassportSection>
          <SectionHeading variation='secondary' size='small'>Evaluation</SectionHeading>
          <SectionDl type='horizontal'>
            <dt>Term</dt>
            <dd>Definition</dd>
            <dt>Term</dt>
            <dd>Definition</dd>
          </SectionDl>
        </PassportSection>
        <pre>
          {JSON.stringify(data, null, '  ')}
        </pre>
      </div>
    );
  }

  render () {
    if (!this.props.visible) return null;

    const { isReady, hasError } = this.props.rooftop;

    const images = [
      'http://loremflickr.com/1440/720/lego',
      'http://loremflickr.com/1440/720/lego?v1',
      'http://loremflickr.com/1440/720/lego?v2',
      'http://loremflickr.com/1440/720/lego?v3',
      'http://loremflickr.com/1440/720/lego?v4',
      'http://loremflickr.com/1440/720/lego?v5',
      'http://loremflickr.com/1440/720/lego?v6'
    ];

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

        {!hasError() && isReady() && this.renderData()}

        {!hasError() && isReady() && (
          <CarouselModal
            images={images}
            revealed={this.state.galleryRevealed}
            onCloseClick={this.onModalCloseClick}
          />
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
