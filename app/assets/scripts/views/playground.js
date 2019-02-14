'use strict';
import React from 'react';
import styled from 'styled-components';

import { themeVal } from '../atomic-components/utils/functions';
import collecticon from '../atomic-components/collecticons';

import Button from '../atomic-components/button';
import ButtonGroup from '../atomic-components/button-group';
import Dropdown from '../components/common/dropdown';

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;

  ::before {
    ${collecticon('plus')};
    margin-right: 1rem;
  }

  ::after {
    margin-left: 1rem;
  }
`;

// Create a main component to center the body.
const Main = styled.main`
  max-width: ${themeVal('layout.rowMaxWidth')};
  margin: auto;
`;

// Create a ul component to include some styling.
const Ul = styled.ul`
  margin-bottom: 2rem;

  > li {
    margin-bottom: 1rem;
  }

  > li:last-child {
    margin-bottom: 0;
  }
`;

// Extend the component previously created to change the background
// This is needed to see the achromic buttons.
const DarkUl = styled(Ul)`
  background: ${themeVal('colors.baseColor')};
`;

// Extend a button to add an icon.
const ButtonIconBrand = styled(Button)`
  ::before {
    ${collecticon('marker')}
  }
`;

// Below the differente button variations and sizes to render all buttons.

const variations = [
  'base-raised-light',
  'base-raised-semidark',
  'base-raised-dark',
  'base-plain',
  'primary-raised-light',
  'primary-raised-semidark',
  'primary-raised-dark',
  'primary-plain',
  'danger-raised-light',
  'danger-raised-dark',
  'danger-plain'
];

const lightVariations = ['achromic-plain', 'achromic-glass'];

const sizes = ['small', 'default', 'large', 'xlarge'];

export default class Playground extends React.Component {
  render () {
    return (
      <div>
        <header>
          <Title>Housing Passports - Playground</Title>
        </header>
        <Main>
          <Dropdown
            triggerElement={
              <Button variation={'base-raised-light'}>Hello</Button>
            }
            direction='down'
            alignment='center'
          >
            <h6 className='drop__title'>Browse</h6>
            <ul className='drop__menu drop__menu--select'>
              <li>helooooo</li>
              <li>
                <button type='button' data-hook='dropdown:close'>
                  close
                </button>
              </li>
            </ul>
          </Dropdown>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div style={{ marginLeft: '5rem' }}>
            <Dropdown
              triggerElement={
                <Button variation={'base-raised-light'}>another</Button>
              }
              direction='left'
              alignment='middle'
            >
              <h6 className='drop__title'>Browse</h6>
              <ul className='drop__menu drop__menu--select'>
                <li>helooooo</li>
                <li>
                  <button type='button' data-hook='dropdown:close'>
                    close
                  </button>
                </li>
              </ul>
            </Dropdown>
          </div>
          <div>
            <h1>Button Group</h1>
            <ButtonGroup orientation='horizontal'>
              <Button variation='base-raised-light'>First</Button>
              <Button variation='base-raised-light'>Second</Button>
              <Button variation='base-raised-light'>Third</Button>
            </ButtonGroup>
            <ButtonGroup orientation='horizontal'>
              <ButtonIconBrand variation='base-raised-light'>
                First
              </ButtonIconBrand>
              <ButtonIconBrand variation='base-raised-light'>
                Second
              </ButtonIconBrand>
              <ButtonIconBrand variation='base-raised-light'>
                Third
              </ButtonIconBrand>
            </ButtonGroup>
            <ButtonGroup orientation='vertical'>
              <Button variation='base-raised-light'>First</Button>
              <Button variation='base-raised-light'>Second</Button>
              <Button variation='base-raised-light'>Third</Button>
            </ButtonGroup>
          </div>
          <div>
            <h1>Buttons</h1>
            <ButtonIconBrand variation='base-raised-light'>
              I have an icon
            </ButtonIconBrand>
            <ButtonIconBrand variation='base-raised-light' hideText>
              this text is hidden
            </ButtonIconBrand>

            {variations.map(variation => (
              <Ul key={variation}>
                {sizes.map(size => (
                  <li key={size}>
                    <Button variation={variation} size={size}>
                      {size} - {variation}
                    </Button>
                  </li>
                ))}
              </Ul>
            ))}
            {lightVariations.map(variation => (
              <DarkUl key={variation}>
                {sizes.map(size => (
                  <li key={size}>
                    <Button variation={variation} size={size}>
                      {size} - {variation}
                    </Button>
                  </li>
                ))}
              </DarkUl>
            ))}
          </div>
        </Main>
      </div>
    );
  }
}
