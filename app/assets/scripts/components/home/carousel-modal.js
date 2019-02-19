'use strict';
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { PropTypes as T } from 'prop-types';
import { Carousel } from 'react-responsive-carousel';

import { environment } from '../../config';

import { Modal, ModalBody, ModalHeader } from '../common/modal';

const ModalTitle = styled.h1`
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
`;

const ModalSubtitle = styled.p`
  text-transform: uppercase;
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
    const { id, images, revealed, onCloseClick } = this.props;
    return (
      <Modal
        id={id}
        size='full'
        revealed={revealed}
        onCloseClick={onCloseClick}
        headerComponent={(
          <ModalHeader>
            <ModalTitle>Photo</ModalTitle>
            <ModalSubtitle>{this.state.galleryCurrImg + 1} of {images.length}</ModalSubtitle>
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
