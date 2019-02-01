'use strict';
import React from 'react';
import styled from 'styled-components';
import collecticon from '../atomic-components/collecticons';

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;

  ::before {
    ${collecticon('brand-devseed')}
    margin-right: 1rem;
  }

  ::after {
    ${collecticon('brand-devseed')}
    margin-left: 1rem;
  }
`;

export default class Home extends React.Component {
  render () {
    return (
      <div>
        <header>
          <Title>Housing Passports</Title>
        </header>
        <main>This is the site's body</main>
        <footer>Footer</footer>
      </div>
    );
  }
}
