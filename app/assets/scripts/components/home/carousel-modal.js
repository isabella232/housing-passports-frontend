'use strict';
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { rgba } from 'polished';
import { PropTypes as T } from 'prop-types';
import { Carousel } from 'react-responsive-carousel';

import { environment } from '../../config';
import { themeVal } from '../../atomic-components/utils/functions';
import { Modal, ModalBody, ModalHeader } from '../common/modal';
import Button from '../../atomic-components/button';
import collecticons from '../../atomic-components/collecticons';

const ModalToolbar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin-left: auto;
  align-items: center;
  align-self: flex-start;
`;

const ModalClose = styled(Button)`
  &::before {
    ${collecticons('xmark')}
  }
`;

const ModalTitle = styled.h1`
  font-family: ${themeVal('typography.headingFontFamily')};
  font-weight: ${themeVal('typography.headingFontWeight')};
  letter-spacing: 0.125em;
  font-size: 1rem;
  line-height: 1.25rem;
  text-transform: uppercase;
  color: ${themeVal('colors.primaryColor')};
  margin: 0;
`;

const ModalSubtitle = styled.p`
  font-feature-settings: "pnum" 0; /* Use proportional numbers */
  font-family: ${themeVal('typography.headingFontFamily')};
  font-weight: ${themeVal('typography.headingFontRegular')};
  text-transform: uppercase;
  color: ${({ theme }) => rgba(theme.typography.baseFontColor, 0.64)};
  font-size: 0.875rem;
  margin: 0;
`;

const ModalBodyCarousel = styled(ModalBody)`
  height: calc(100vh - 6rem);

  > div {
    height: 100%;
    display: flex;
    flex-flow: column;
  }
`;

const CarouselStylesOverrides = createGlobalStyle`
  .carousel.carousel-slider {
    flex-grow: 1;
    height: 100%;
  }

  .carousel {
    flex-grow: 0;
  }

  .slider-wrapper,
  .slider-wrapper .slider {
    height: 100%;
  }

  .carousel .slide img {
    height: 100%;
    width: auto;
    display: block;
    margin: 0 auto;
  }

  .carousel .slide {
    background: none;
  }
`;

class CarouselModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      galleryCurrImg: 0
    };

    this.onGalleryChange = this.onGalleryChange.bind(this);
  }

  onGalleryChange (idx) {
    this.setState({ galleryCurrImg: idx });
  }

  render () {
    const { id, images, revealed } = this.props;
    return (
      <Modal
        id={id}
        size='full'
        revealed={revealed}
        headerComponent={(
          <ModalHeader>
            <div>
              <ModalTitle>Photo</ModalTitle>
              <ModalSubtitle>{this.state.galleryCurrImg + 1} of {images.length}</ModalSubtitle>
            </div>
            <ModalToolbar>
              <ModalClose
                variation='base-plain'
                hideText
                title='Close gallery'
              >
                Close gallery
              </ModalClose>
            </ModalToolbar>
          </ModalHeader>
        )}
        bodyComponent={(
          <ModalBodyCarousel>
            <CarouselStylesOverrides />
            <Carousel
              selectedItem={this.state.galleryCurrImg}
              useKeyboardArrows
              showIndicators={false}
              showStatus={false}
              onChange={this.onGalleryChange}
            >
              {images.map(img => <img key={img} src={img} />)}
            </Carousel>
          </ModalBodyCarousel>
        )}
      />
    );
  }
}

if (environment !== 'production') {
  CarouselModal.propTypes = {
    id: T.string,
    images: T.array,
    revealed: T.bool,
    onCloseClick: T.func
  };
}

export default CarouselModal;
