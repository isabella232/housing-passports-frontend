import get from 'lodash.get';

/**
 * Return the a function that when executed appends the `unit` to the value.
 *
 * @example
 * const percent = unitify('%');
 * percent(10) // -> 10%
 *
 * @param {string} unit The unit to use
 */
export const unitify = unit => v =>
  typeof v === 'function' ? (...args) => `${v(...args)}${unit}` : `${v}${unit}`;

/**
 * Return the given value with `rem` appended.
 * If value is a function will execute it. This allows to use directly in
 * styled-components with themeVal
 *
 * @see themeVal()
 *
 * @example
 * rem(themeVal('shape.rounded'))
 *
 * @param {mixed} val The value
 */
export const rem = unitify('rem');

/**
 * Return the given value with `px` appended.
 * If value is a function will execute it. This allows to use directly in
 * styled-components with themeVal
 *
 * @see themeVal()
 *
 * @example
 * px(themeVal('shape.rounded'))
 *
 * @param {mixed} val The value
 */
export const px = unitify('px');

/**
 * Returns a function to be used with styled-components and get's a value from
 * the theme property.
 *
 * @param {string} path The path to get from theme
 */
export const themeVal = path => ({ theme }) => {
  const v = get(theme, path, undefined);
  if (v === undefined) {
    console.error( // eslint-disable-line
      `Theme Value Error: path [${path}] not found in theme.`,
      theme
    );
  }
  return v;
};
