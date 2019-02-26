import { css } from 'styled-components';
import { rgba } from 'polished';

import { themeVal } from '../atomic-components/utils/functions';

export default () => css`
  .carousel .thumbs-wrapper {
    margin: ${themeVal('layout.globalSpacing')};
    overflow: hidden;
  }

  .carousel .thumbs {
    display: flex;
    justify-content: center;
    position: relative;
    list-style: none;
    transform: translate3d(0, 0, 0);
    transition: all 0.08s ease-in;
    margin: 0;
  }

  .carousel .thumb {
    overflow: hidden;
    position: relative;
    z-index: 1;
    border-radius: ${themeVal('shape.rounded')};
    background: #fff;
    width: 6rem;
    height: 4rem;
    cursor: pointer;
    transition: all 0.08s ease-in;
    display: inline-flex;
    margin: 0.5rem;

    > img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      display: block;
    }

    border: 2px solid #fff;
    padding: 2px;
  }

  .carousel .thumb:focus {
    border-color: ${({ theme }) => rgba(theme.colors.baseColor, 0.32)};
    outline: none;
  }

  .carousel .thumb:hover {
    border-color: ${({ theme }) => rgba(theme.colors.baseColor, 0.64)};
  }

  .carousel .thumb.selected {
    border-color: ${themeVal('colors.primaryColor')};
  }
`;
