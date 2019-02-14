import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { rgba, shade, tint } from 'polished';

import { environment } from '../config';
import { antialiased, visuallyHidden } from './utils';
import { themeVal } from './utils/functions';

const BaseButton = ({
  children,
  active,
  hideText,
  size,
  variation,
  type,
  element: El,
  ...rest
}) => {
  type = El === 'button' ? type || 'button' : '';
  return (
    <El {...rest} type={type}>
      <span>{children}</span>
    </El>
  );
};

if (environment !== 'production') {
  BaseButton.propTypes = {
    element: T.oneOfType([T.elementType, T.string]).isRequired,
    type: T.string,
    children: T.node,
    active: T.bool,
    hideText: T.bool,
    size: T.string,
    variation: T.string
  };
}

BaseButton.defaultProps = {
  element: 'button',
  type: 'button',
  size: 'medium'
};

/**
 * Renders a Button element with a span inide it.
 *
 * @param {string} variation Allows for style variation. (Required) One of:
 *                 base-raised-light
 *                 base-raised-semidark
 *                 base-raised-dark
 *                 base-plain
 *                 primary-raised-light
 *                 primary-raised-semidark
 *                 primary-raised-dark
 *                 primary-plain
 *                 danger-raised-light
 *                 danger-raised-dark
 *                 danger-plain
 *                 achromic-plain
 *                 achromic-glass
 * @param {string} size Allows for size variation. (Optional) One of:
 *                 small
 *                 medium (default)
 *                 large
 *                 xlarge
 */
const Button = styled(BaseButton)`
  ${antialiased()}
  user-select: none;
  display: inline-block;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  line-height: 1.5rem;
  font-size: 1rem;
  padding: 0.25rem 0.75rem;
  min-width: 2rem;
  background: none;
  text-shadow: none;
  border: 0;
  border-radius: ${themeVal('shape.rounded')};
  font-family: ${themeVal('typography.baseFontFamily')};
  font-weight: ${themeVal('typography.baseFontBold')};
  cursor: pointer;

  /* States */

  &,
  &:focus {
    outline: none; /* This causes usability problems. Needs fixing. */
  }

  &:hover {
    opacity: initial;
  }

  ${({ active }) => (active ? '&,' : '')}
  &:active { /* stylelint-disable-line */
    z-index: 2;
    transform: none;
  }

  /* Icon handling */

  &::before,
  &::after {
    font-size: 1rem;
  }

  &::before { margin-right: 0.375rem; }
  &::after { margin-left: 0.375rem; }

  &::before,
  &::after,
  > * {
    vertical-align: top;
    display: inline-block;
    line-height: inherit !important;
  }

  /* Checkbox/radio handling */

  > input[type=checkbox],
  > input[type=radio] {
    ${visuallyHidden()}
  }

  /* Animation */

  transition: background-color 0.24s ease 0s;

  /* Variations */
  ${props => renderButtonVariation(props)}

  /* Size */
  ${props => renderButtonSize(props)}

  /* Hide Text */
  ${({ hideText }) =>
    hideText &&
    css`
      padding-left: 0;
      padding-right: 0;

      &::before,
      &::after {
        margin: 0;
      }

      > * {
        ${visuallyHidden()}
      }
    `}
`;

if (environment !== 'production') {
  Button.propTypes = {
    children: T.node,
    active: T.bool,
    hideText: T.bool,
    variation: T.string,
    size: T.string
  };
}

export default Button;

// /////////////////////////////////////////////////////////////////////////////
//                                 HELPER FUNCTIONS
// /////////////////////////////////////////////////////////////////////////////

/**
 * Creates the css for a button variation.
 *
 * @param {string} color The base color for the button
 * @param {string} style The button style
 * @param {string} brightness The button brightness
 * @param {object} props The element props
 */
function buttonVariation (color, style, brightness, { theme }) {
  let textColor = null;
  let bgColor = null;
  let bgColorHover = null;
  let bgColorActive = null;
  let shadowColor = null;

  switch (style) {
    case 'raised':
      switch (brightness) {
        case 'light':
          textColor = color;
          bgColor = tint(1, color);
          bgColorHover = tint(0.96, color);
          bgColorActive = tint(0.92, color);
          shadowColor = rgba(theme.colors.baseColor, 0.16);
          break;
        case 'semidark':
          textColor = color;
          bgColor = tint(0.88, color);
          bgColorHover = tint(0.84, color);
          bgColorActive = tint(0.8, color);
          shadowColor = rgba(theme.colors.baseColor, 0.16);
          break;
        case 'dark':
          textColor = tint(1, color);
          bgColor = color;
          bgColorHover = shade('8%', color);
          bgColorActive = shade('12%', color);
          shadowColor = rgba(theme.colors.baseColor, 0.24);
          break;
        default:
          console.error('Invalid brightness property for button raised'); // eslint-disable-line
          break;
      }
      break;
    case 'glass':
      textColor = color;
      bgColor = rgba(color, 0.16);
      bgColorHover = rgba(color, 0.24);
      bgColorActive = rgba(color, 0.32);
      break;
    case 'plain':
      textColor = color;
      bgColor = rgba(color, 0);
      bgColorHover = rgba(color, 0.08);
      bgColorActive = rgba(color, 0.16);
      break;
    default:
      console.error('Invalid style property for button'); // eslint-disable-line
      break;
  }

  return css`
    background-color: ${bgColor};

    &,
    &:visited {
      color: ${textColor};
    }

    ${shadowColor &&
      css`
        box-shadow: 0 -1px 1px 0 ${rgba(theme.colors.baseColor, 0.08)},
          0 2px 6px 0 ${shadowColor};
      `}

    /* &.button--hover, */
    &:hover {
      background-color: ${bgColorHover};
    }

    ${({ active }) => (active ? '&, &:hover,' : '')}
    &:active {
      /* stylelint-disable-line */
      background-color: ${bgColorActive};
      ${shadowColor &&
        css`
          box-shadow: inset 0 1px 2px 0 ${shadowColor};
        `}
    }
  `;
}

/**
 * Renders the correct button variation based on the props.
 *
 * @param {object} props The element props
 */
function renderButtonVariation (props) {
  switch (props.variation) {
    case 'base-raised-light':
      return buttonVariation(
        props.theme.typography.baseFontColor,
        'raised',
        'light',
        props
      );
    case 'base-raised-semidark':
      return buttonVariation(
        props.theme.typography.baseFontColor,
        'raised',
        'semidark',
        props
      );
    case 'base-raised-dark':
      return buttonVariation(
        props.theme.typography.baseFontColor,
        'raised',
        'dark',
        props
      );
    case 'base-plain':
      return buttonVariation(
        props.theme.typography.baseFontColor,
        'plain',
        'light',
        props
      );
    case 'primary-raised-light':
      return buttonVariation(
        props.theme.colors.primaryColor,
        'raised',
        'light',
        props
      );
    case 'primary-raised-semidark':
      return buttonVariation(
        props.theme.colors.primaryColor,
        'raised',
        'semidark',
        props
      );
    case 'primary-raised-dark':
      return buttonVariation(
        props.theme.colors.primaryColor,
        'raised',
        'dark',
        props
      );
    case 'primary-plain':
      return buttonVariation(
        props.theme.colors.primaryColor,
        'plain',
        'light',
        props
      );
    case 'danger-raised-light':
      return buttonVariation(
        props.theme.colors.dangerColor,
        'raised',
        'light',
        props
      );
    case 'danger-raised-dark':
      return buttonVariation(
        props.theme.colors.dangerColor,
        'raised',
        'dark',
        props
      );
    case 'danger-plain':
      return buttonVariation(
        props.theme.colors.dangerColor,
        'plain',
        'light',
        props
      );
    case 'achromic-plain':
      return buttonVariation('#fff', 'plain', null, props);
    case 'achromic-glass':
      return buttonVariation('#fff', 'glass', null, props);
  }
}

/**
 * Renders the correct button size based on the props.
 *
 * @param {object} props The element props
 */
function renderButtonSize (props) {
  switch (props.size) {
    // Small (24px)
    case 'small':
      return css`
        line-height: 1.25rem;
        font-size: 0.875rem;
        padding: 0.125rem 0.5rem;
        min-width: 1.5rem;
      `;
    case 'large':
      return css`
        line-height: 1.5rem;
        font-size: 1rem;
        padding: 0.5rem 1.5rem;
        min-width: 2.5rem;
      `;
    case 'xlarge':
      return css`
        line-height: 2rem;
        font-size: 1rem;
        padding: 0.5rem 2rem;
        min-width: 3rem;
      `;
    // Medium (32px)
    default:
      return css`
        line-height: 1.5rem;
        font-size: 1rem;
        padding: 0.25rem 1rem;
        min-width: 2rem;
      `;
  }
}
