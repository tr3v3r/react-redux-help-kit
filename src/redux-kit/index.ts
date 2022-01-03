import {loadingReducer, successReducer, errorReducer} from './reducers';
import type {StateType} from './types';

export const asyncReducers = {
  loading: loadingReducer,
  success: successReducer,
  error: errorReducer,
};

export type ReduxKitState = StateType<typeof asyncReducers>;
