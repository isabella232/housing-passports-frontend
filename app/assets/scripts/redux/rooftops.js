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
  return {
    type: RECEIVE_ROOFTOP_CENTROIDS,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetchRooftopCentroids () {
  return fetchDispatchCacheFactory({
    statePath: 'rooftops.centroids',
    url: `${baseurl}/assets/data/rooftops-centroids.json`,
    requestFn: requestRooftopCentroids,
    receiveFn: receiveRooftopCentroids
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

function rooftopCentroidsReducer (
  state = rooftopCentroidsReducerInitialState,
  action
) {
  return baseAPIReducer(state, action, 'ROOFTOP_CENTROIDS');
}

// /////////////////////////////////////////////////////////////////////////////
// Actions
// /////////////////////////////////////////////////////////////////////////////

export const REQUEST_ROOFTOP = 'REQUEST_ROOFTOP';
export const RECEIVE_ROOFTOP = 'RECEIVE_ROOFTOP';
export const INVALIDATE_ROOFTOP = 'INVALIDATE_ROOFTOP';

export function invalidateRooftop (id) {
  return { type: INVALIDATE_ROOFTOP, id };
}

export function requestRooftop (id) {
  return { type: REQUEST_ROOFTOP, id };
}

export function receiveRooftop (id, data, error = null) {
  return { type: RECEIVE_ROOFTOP, id, data, error, receivedAt: Date.now() };
}

export function fetchRooftop (rooftopId) {
  return fetchDispatchCacheFactory({
    statePath: ['rooftops', 'individualRooftops', rooftopId],
    url: `${baseurl}/assets/data/rooftops/${rooftopId}.json`,
    requestFn: requestRooftop.bind(this, rooftopId),
    receiveFn: receiveRooftop.bind(this, rooftopId)
  });
}

// /////////////////////////////////////////////////////////////////////////////
// Reducer
// /////////////////////////////////////////////////////////////////////////////

const rooftopReducerInitialState = {
  // rooftopId: {
  //   fetching: false,
  //   fetched: false,
  //   error: null,
  //   data: []
  // }
};

function rooftopReducer (state = rooftopReducerInitialState, action) {
  return baseAPIReducer(state, action, 'ROOFTOP');
}

// /////////////////////////////////////////////////////////////////////////////
// Combine reducers and export
// /////////////////////////////////////////////////////////////////////////////

export default combineReducers({
  centroids: rooftopCentroidsReducer,
  individualRooftops: rooftopReducer
});
