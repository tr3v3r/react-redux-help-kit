import {
  loadingReducer,
  successReducer,
  errorReducer,
  byIdReducer,
} from './reducers';
import type {StateType} from './types';

export const asyncReducers = {
  loading: loadingReducer,
  success: successReducer,
  error: errorReducer,
};

export {byIdReducer};

export type ReduxKitState = StateType<typeof asyncReducers>;
