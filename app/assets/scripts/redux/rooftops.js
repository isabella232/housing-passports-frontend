'use script';
import { combineReducers } from 'redux';

import { fetchDispatchCacheFactory, baseAPIReducer } from './utils';
import { baseurl } from '../config';

// /////////////////////////////////////////////////////////////////////////////
// Actions
// /////////////////////////////////////////////////////////////////////////////

export const REQUEST_ROOFTOP_CENTROIDS = 'REQUEST_ROOFTOP_CENTROIDS';
export const RECEIVE_ROOFTOP_CENTROIDS = 'RECEIVE_ROOFTOP_CENTROIDS';
export const INVALIDATE_ROOFTOP_CENTROIDS = 'INVALIDATE_ROOFTOP_CENTROIDS';

export function invalidateRooftopCentroids () {
  return { type: INVALIDATE_ROOFTOP_CENTROIDS };
}

export function requestRooftopCentroids () {
  return { type: REQUEST_ROOFTOP_CENTROIDS };
}

export function receiveRooftopCentroids (data, error = null) {
  return { type: RECEIVE_ROOFTOP_CENTROIDS, data, error, receivedAt: Date.now() };
}

export function fetchRooftopCentroids () {
  return fetchDispatchCacheFactory({
    statePath: 'centroids',
    url: `${baseurl}/assets/data/rooftops-centroids.json`,
    requestFn: requestRooftopCentroids,
    receiveFn: receiveRooftopCentroids,
    mutator: response => response.map((coords, id) => ({ id, coords }))
  });
}

// /////////////////////////////////////////////////////////////////////////////
// Reducer
// /////////////////////////////////////////////////////////////////////////////

const rooftopCentroidsReducerInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: []
};

function rooftopCentroidsReducer (state = rooftopCentroidsReducerInitialState, action) {
  return baseAPIReducer(state, action, 'ROOFTOP_CENTROIDS');
}

// /////////////////////////////////////////////////////////////////////////////
// Combine reducers and export
// /////////////////////////////////////////////////////////////////////////////

export default combineReducers({
  centroids: rooftopCentroidsReducer
});
