import {loadingReducer, successReducer, errorReducer} from './redux-kit';
import {useOnRequestSuccess, useRequestError, useRequestLoading} from './hooks';

const asyncReducers = {
  loading: loadingReducer,
  success: successReducer,
  error: errorReducer,
};

export {asyncReducers, useOnRequestSuccess, useRequestError, useRequestLoading};
