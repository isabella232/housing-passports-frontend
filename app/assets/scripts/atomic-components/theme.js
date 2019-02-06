import { rgba, tint } from 'polished';

let colors = {
  baseColor: '#000000',
  primaryColor: '#D9166F',
  secondaryColor: '#ffc700',
  dangerColor: '#d85d3f',
  successColor: '#216869',
  warningColor: '#ffc700',
  infoColor: '#5860ff'
};

colors = {
  ...colors,
  linkColor: colors.primaryColor,
  baseAlphaColor: rgba(colors.baseColor, 0.08)
};

let typography = {
  rootFontSize: '16px',
  baseFontColor: tint(0.16, colors.baseColor),
  baseFontFamily: "'Open Sans', sans-serif",
  baseFontStyle: 'normal',
  baseFontLight: 300,
  baseFontRegular: 400,
  baseFontMedium: 500,
  baseFontBold: 700,
  baseFontWeight: 300,
  baseFontSize: '1rem',
  baseLineHeight: 1.5
};

typography = {
  ...typography,
  headingFontFamily: "'Josefin Sans', sans-serif",
  headingFontLight: 300,
  headingFontRegular: 400,
  headingFontMedium: 500,
  headingFontBold: 700,
  headingFontWeight: 700
};

let shape = {
  rounded: '0.25rem',
  ellipsoid: '320rem',
  borderWidth: '1px'
};

let layout = {
  globalSpacing: '1rem',
  rowMinWidth: '960px',
  rowMaxWidth: '1280px'
};

export default {
  main: {
    layout,
    colors,
    typography,
    shape
  }
};

/**
 * Media query ranges used by the media utility.
 * They're not exported with the main theme because the utility does not
 * build the media functions in runtime, needing the values beforehand.
 */
export const mediaRanges = {
  xsmall: [null, 543],
  small: [544, 767],
  medium: [768, 991],
  large: [992, 1199],
  xlarge: [1200, null]
};
