import { createGlobalStyle, css } from 'styled-components';
import { normalize } from 'polished';

import { themeVal } from './atomic-components/utils/functions';
import { collecticonsFont } from './atomic-components/collecticons';

// Global styles for these components are included here for performance reasons.
// This way they're only rendered when absolutely needed.
import mapboxStyle from './vendor/mapbox';
import mapillaryStyle from './vendor/mapillary';

const baseStyles = css`
  html {
    box-sizing: border-box;
    font-size: ${themeVal('typography.rootFontSize')};

    /* Changes the default tap highlight to be completely transparent in iOS. */
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  body {
    background: #fff;
    color: ${themeVal('typography.baseFontColor')};
    font-size: ${themeVal('typography.baseFontSize')};
    line-height: ${themeVal('typography.baseLineHeight')};
    font-family: ${themeVal('typography.baseFontFamily')};
    font-weight: ${themeVal('typography.baseFontWeight')};
    font-style: ${themeVal('typography.baseFontStyle')};
    min-width: ${themeVal('layout.rowMinWidth')};
  }
`;

export default createGlobalStyle`
  ${normalize()}
  ${collecticonsFont()}
  ${baseStyles}
  ${mapboxStyle}
  ${mapillaryStyle}
`;
