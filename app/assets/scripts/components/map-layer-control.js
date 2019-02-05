'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';

import { environment } from '../config';

import Dropdown from './dropdown';
import Button from '../atomic-components/button';
import collecticon from '../atomic-components/collecticons';

const LayerButton = styled(Button)`
  ::before {
    ${collecticon('map')}
  }
`;

// React component for the layer control.
// It is disconnected from the global state because it needs to be included
// via the mapbox code.
export default class LayerControlDropdown extends React.Component {
  render () {
    return (
      <Dropdown
        triggerElement={<LayerButton variation={'base-raised-light'} hideText >Select map layers</LayerButton>}
        direction='right'
        alignment='middle' >

        <h6 className='drop__title'>Browse</h6>
        <ul className='drop__menu drop__menu--select'>
          <li>layer</li>
          <li>layer</li>
          <li>layer</li>
        </ul>

      </Dropdown>
    );
  }
}

if (environment !== 'production') {
  LayerControlDropdown.propTypes = {
    layersConfig: T.array,
    layersState: T.array,
    handleLayerChange: T.func
  };
}

const Toggle = props => {
  const { text, name, title, checked, onChange } = props;

  return (
    <label
      htmlFor={name}
      className='form__option form__option--switch'
      title={title}
    >
      <input
        type='checkbox'
        name={name}
        id={name}
        value='on'
        checked={checked}
        onChange={onChange}
      />
      <span className='form__option__text'>{text}</span>
      <span className='form__option__ui' />
    </label>
  );
};

if (environment !== 'production') {
  Toggle.propTypes = {
    text: T.string,
    name: T.string,
    title: T.string,
    checked: T.bool,
    onChange: T.func
  };
}

LayerControlDropdown.propTypes = {
  layers: T.array,
  onLayerChange: T.func
};
