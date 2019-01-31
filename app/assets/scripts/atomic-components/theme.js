import { rgba, tint } from 'polished';

let colors = {
  baseColor: '#14213d',
  primaryColor: '#5860ff',
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
  rootFontSize: 16,
  baseFontColor: tint('16%', colors.baseColor),
  baseFontFamily: 'Verdana',
  baseFontStyle: 'normal',
  baseFontLight: 300,
  baseFontRegular: 400,
  baseFontMedium: 500,
  baseFontBold: 500,
  baseFontWeight: 300,
  baseFontSize: '1rem',
  baseLineHeight: 1.5
};

// typography = {
//   ...typography;
//   //...
// };

let shape = {
  rounded: 0.25,
  ellipsoid: 320
};

let layout = {
  globalSpacing: '1rem',
  rowMinWidth: 960,
  rowMaxWidth: 1280
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
