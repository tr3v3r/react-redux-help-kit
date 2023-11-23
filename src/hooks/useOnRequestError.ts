import {useDispatch, ReactReduxContext} from 'react-redux';
import {useEffect, useCallback, useContext, useRef} from 'react';

import {ReduxKitState} from '../redux-kit';
import {clearErrorByActionType} from '../redux-kit/reducers';
import {Action} from './types';
import {IError} from '../types';
import {useStaticCallback} from './useStaticCallback';
import {IErrorReducerState} from '../redux-kit/reducers/errorReducer';

export function useOnRequestError<T extends IError>(
  action: Action,
  callback: (error: T | null, entityId: string | null) => void,
  autoClear = true,
) {
  const {store} = useContext(ReactReduxContext);
  const prevErrorState = useRef({});
  const {type, meta} = typeof action === 'function' ? action() : action;
  const actionTypeKey = type.replace('_REQUEST', '');
  const key = `${actionTypeKey}${meta?.reducerId || ''}`;

  const dispatch = useDispatch();

  const clearError = useCallback(() => {
    dispatch(clearErrorByActionType(key));
  }, [dispatch, key]);

  useEffect(() => {
    return clearError;
  }, [clearError]);

  const getErrorState = useCallback(() => {
    const state: ReduxKitState = store.getState();
    const errorState = state.error[key];

    return errorState;
  }, [key, store]);

  const getErrorData = useCallback((errorState: IErrorReducerState[string]) => {
    const {error = null, entityId = null} = errorState || {};

    return {
      error,
      entityId,
    };
  }, []);

  const staticErrorCallback = useStaticCallback(
    (errorState: IErrorReducerState[string]) => {
      const {error, entityId} = getErrorData(errorState);
      if (callback && error) {
        if (autoClear) {
          clearError();
        }
        callback(error as T | null, entityId);
      }
    },
    [autoClear, callback, clearError, getErrorData],
  );

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const errorState = getErrorState();
      const isStateUpdated =
        errorState && prevErrorState.current !== errorState;
      prevErrorState.current = errorState;

      if (isStateUpdated) {
        staticErrorCallback(errorState);
      }
    });

    return unsubscribe;
  }, [getErrorState, staticErrorCallback, store]);
}
