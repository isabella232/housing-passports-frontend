import { css } from 'styled-components';

import { themeVal } from '../atomic-components/utils/functions';
import collecticons from '../atomic-components/collecticons';
import { buttonVariation } from '../atomic-components/button';
import { antialiased } from '../atomic-components/utils';
// Some dependencies include styles that must be included.
// This file includes the mapbox styles with needed overrides to be used
// by styled components.

export default () => css`
  /* Overrides for mapbox styles.
   Move the needed parts from assets/styles/vendor to this file
   and take full advantage of styled-components. */

  .mapboxgl-ctrl-group {
    position: relative;
    display: inline-flex;
    flex-flow: column;
    border-radius: ${themeVal('shape.borderWidth')};
    background: none;
    box-shadow: 0 0 16px 4px ${themeVal('colors.baseAlphaColor')};

    > button {
      ${antialiased()}
      position: relative;
      z-index: 2;
      user-select: none;
      display: block;
      text-align: center;
      white-space: nowrap;
      line-height: 1.5rem;
      font-size: 0;
      padding: 0.25rem 0;
      margin: 0;
      min-width: 2rem;
      background: none;
      text-shadow: none;
      border: 0;
      border-radius: ${themeVal('shape.rounded')};
      font-family: ${themeVal('typography.baseFontFamily')};
      font-weight: ${themeVal('typography.baseFontBold')};
      cursor: pointer;
      ${props =>
    buttonVariation(
      props.theme.typography.baseFontColor,
      'raised',
      'light',
      props
    )}
    }

    > button::before {
      display: block;
      margin: 0;
      font-size: 1rem;
    }

    .mapboxgl-ctrl-zoom-in::before {
      ${collecticons('plus')}
    }

    .mapboxgl-ctrl-zoom-out::before {
      ${collecticons('minus')}
    }

    > button + button {
      margin-top: -${themeVal('shape.borderWidth')};
    }

    > button:first-child:not(:last-child) {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      clip-path: inset(-100% -100% 0 -100%);
    }

    > button:last-child:not(:first-child) {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      clip-path: inset(0 -100% -100% -100%);
    }

    > button:not(:first-child):not(:last-child) {
      border-radius: 0;
      clip-path: inset(0 -100%);
    }
  }
`;
