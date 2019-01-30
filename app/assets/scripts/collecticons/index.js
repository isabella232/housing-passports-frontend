import { css } from 'styled-components';

const catalog = require('./catalog.json');

/**
 * Includes a collecticons icon by name.
 * @param {string} name Icon name
 */
export default function (name) {
  name = `${catalog.className}-${name}`;
  const icon = catalog.icons.find(i => i.icon === name);
  const content = icon ? `\\${icon.charCode}` : 'n/a';

  return css`
    speak: none;
    font-family: "Collecticons";
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;

    /* Better font rendering */
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: "${content}";
  `;
}
