'use strict';
import styled, { css } from 'styled-components';

import { themeVal } from './utils/functions';

const sizeMapping = {
  'small': '0.875rem',
  'medium': '1rem',
  'large': '1.125rem',
  'xlarge': '1.25rem'
};

const lineHeightMapping = {
  'small': '1rem',
  'medium': '1.25rem',
  'large': '1.5rem',
  'xlarge': '1.75rem'
};

const Heading = styled.h1`
  font-family: ${themeVal('typography.headingFontFamily')};
  font-weight: ${themeVal('typography.headingFontWeight')};
  letter-spacing: 0.125em;
  text-transform: uppercase;

  /* Size and line-height attribute */
  ${({ size }) => `
    font-size: ${sizeMapping[size]};
    line-height: ${lineHeightMapping[size]};
  `}

  /* Colors */
  color: inherit;
  ${({ variation }) => variation === 'base' && css` color: ${themeVal('typography.baseFontColor')}; `};
  ${({ variation }) => variation === 'primary' && css` color: ${themeVal('colors.primaryColor')}; `};
  ${({ variation }) => variation === 'secondary' && css` color: ${themeVal('colors.secondaryColor')}; `};
`;

Heading.defaultProps = {
  size: 'medium'
};

export default Heading;
