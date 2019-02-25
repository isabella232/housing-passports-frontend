'use strict';
import styled, { css } from 'styled-components';

import { themeVal } from './utils/functions';

const sizeMapping = {
  small: '0.875rem',
  medium: '1rem',
  large: '1.125rem',
  xlarge: '1.25rem'
};

const lineHeightMapping = {
  small: '1rem',
  medium: '1.25rem',
  large: '1.5rem',
  xlarge: '1.75rem'
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
  color:
    ${({ variation, theme }) =>
    variation === 'base'
      ? theme.typography.baseFontColor
      : variation === 'primary'
        ? theme.colors.primaryColor
        : variation === 'secondary'
          ? theme.colors.secondaryColor
          : 'inherit'};
`;

Heading.defaultProps = {
  size: 'medium'
};

export default Heading;

export const headingAlt = () => css`
  font-feature-settings: "pnum" 0; /* Use proportional numbers */
  font-family: ${themeVal('typography.headingFontFamily')};
  font-weight: ${themeVal('typography.headingFontRegular')};
  text-transform: uppercase;
`;
