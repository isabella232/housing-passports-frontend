'use strict';
import styled, { keyframes, css } from 'styled-components';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';
import { rgba } from 'polished';

const pulse = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

export const LoadingSkeleton = styled.span`
  display: ${({ inline }) => inline ? 'inline-block' : 'block'};
  background: ${({ theme }) => rgba(theme.colors.baseColor, 0.08)};
  height: 1rem;
  width: ${({ width }) => (width || 1) * 100}%;
  animation: ${pulse} 0.8s ease 0s infinite alternate;

  /* Size modifier */
  ${({ size }) => size === 'large' && 'height: 2.25rem;'}

  /* Color modifier */
  ${({ variation }) => variation === 'light' && 'background: rgba(#fff, 0.48);'}

  /* type modifier */
  ${({ type }) => type === 'heading' && css`
    background: ${({ theme }) => rgba(theme.colors.baseColor, 0.16)};
    ${({ variation }) => variation === 'light' && 'background: rgba(#fff, 0.80);'}
  `}
`;

if (environment !== 'production') {
  LoadingSkeleton.propTypes = {
    type: T.string,
    variation: T.string,
    size: T.string,
    width: T.number,
    inline: T.bool
  };
}

export const LoadingSkeletonGroup = styled.div`
  margin-bottom: 2rem;

  & > ${LoadingSkeleton} {
    margin-bottom: 0.75rem;
  }
`;

if (environment !== 'production') {
  LoadingSkeletonGroup.propTypes = {
    style: T.object,
    children: T.node
  };
}
