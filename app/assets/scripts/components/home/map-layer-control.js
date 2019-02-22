'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';

import { environment } from '../../config';

import Dropdown from '../common/dropdown';
import Button from '../../atomic-components/button';
import { FormSwitch } from '../../atomic-components/form-options';
import collecticon from '../../atomic-components/collecticons';
import { themeVal } from '../../atomic-components/utils/functions';
import { rgba, clearFix } from 'polished';
import { divide } from '../../atomic-components/utils/math';
import { headingAlt } from '../../atomic-components/heading';

const LayerButton = styled(Button)`
  ::before {
    ${collecticon('iso-stack')}
  }
`;

const DropTitle = styled.h6`
  ${headingAlt()}
  color: ${({ theme }) => rgba(theme.typography.baseFontColor, 0.64)};
  font-size: 0.875rem;
  line-height: 1rem;
  margin: 0 0 ${themeVal('layout.globalSpacing')} 0;
`;

const LayersList = styled.ul`
  list-style: none;
  margin: 0 -${themeVal('layout.globalSpacing')};
  padding: 0;

  > li {
    padding: ${themeVal('layout.globalSpacing')};
    box-shadow: 0 ${themeVal('shape.borderWidth')} 0 0 ${themeVal('colors.baseAlphaColor')};
  }

  > li:first-child {
    padding-top: 0;
  }

  > li:last-child {
    padding-bottom: 0;
    box-shadow: none;
  }

  > li > *:last-child {
    margin-bottom: 0;
  }
`;

// React component for the layer control.
// It is disconnected from the global state because it needs to be included
// via the mapbox code.
export default class LayerControlDropdown extends React.Component {
  render () {
    return (
      <Dropdown
        triggerElement={
          <LayerButton variation={'base-raised-light'} hideText>
            Select map layers
          </LayerButton>
        }
        direction='left'
        alignment='middle'
      >
        <DropTitle>Toggle layers</DropTitle>
        <LayersList>
          {this.props.layersConfig.map((layer, idx) => (
            <li key={layer.id}>
              <FormSwitch
                name={`switch-${layer.id}`}
                title='Toggle layer on/off'
                checked={this.props.layersState[idx]}
                onChange={() => this.props.handleLayerChange(idx)}
              >
                {layer.label}
              </FormSwitch>
            </li>
          ))}
        </LayersList>
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
