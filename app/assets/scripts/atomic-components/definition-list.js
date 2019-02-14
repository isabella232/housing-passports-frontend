'use strict';
import styled, { css } from 'styled-components';
import { rgba, clearFix } from 'polished';

import { themeVal } from './utils/functions';
import { divide } from './utils/math';

const Dl = styled.dl`
  dt {
    font-feature-settings: "pnum" 0; /* Use proportional numbers */
    font-family: ${themeVal('typography.headingFontFamily')};
    font-weight: ${themeVal('typography.headingFontRegular')};
    text-transform: uppercase;
    color: ${({ theme }) => rgba(theme.typography.baseFontColor, 0.64)};
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  dd {
    margin: 0 0 ${divide(themeVal('layout.globalSpacing'), 2)} 0;
  }

  dd:last-child {
    margin-bottom: 0;
  }

  ${({ type }) => type === 'horizontal' && css`
    ${clearFix()}

    dd {
      width: 68%;
      padding-left: ${divide(themeVal('layout.globalSpacing'), 2)};
    }

    dd + dd {
      margin-left: 32%;
    }

    dt, dd {
      float: left;
    }

    dt {
      width: 32%;
      clear: left;
      padding-top: ${divide(themeVal('layout.globalSpacing'), 8)};
      padding-bottom: ${divide(themeVal('layout.globalSpacing'), 8)};
      padding-right: ${divide(themeVal('layout.globalSpacing'), 2)};
    }
  `};
`;

export default Dl;
