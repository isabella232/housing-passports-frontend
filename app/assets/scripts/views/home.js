'use strict';
import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
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
