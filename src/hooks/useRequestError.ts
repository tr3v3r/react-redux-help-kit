import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useCallback} from 'react';

import {ReduxKitState} from '../redux-kit';
import {clearErrorByActionType} from '../redux-kit/reducers';
import {Action} from './types';
import {IError} from '../types';
import {find} from '../utils';

export function useRequestError<T extends IError>(
  action: Action,
): {
  error: T | null;
  clearError: (entityId?: string | null) => void;
  getErrorStateByEntityId: (entityId: string) => {
    error: T | null;
    entityId: string | null;
  };
} {
  const {type, meta} = typeof action === 'function' ? action() : action;
  const actionTypeKey = type.replace('_REQUEST', '');
  const key = `${actionTypeKey}${meta?.reducerId || ''}`;

  const dispatch = useDispatch();

  const clearError = useCallback(
    (entityId: string | null = null) => {
      dispatch(clearErrorByActionType(key, entityId));
    },
    [dispatch, key],
  );

  useEffect(() => {
    return clearError;
  }, [clearError]);

  const errorState = useSelector((state: ReduxKitState) => state.error[key]);

  const {error = null} =
    find(errorState || {}, value => Boolean(value.error)) || {};

  const getErrorStateByEntityId = useCallback(
    (id: string) => {
      return (errorState?.[id] || {error: null, entityId: null}) as {
        error: T | null;
        entityId: string | null;
      };
    },
    [errorState],
  );

  return {
    error: error as T,
    clearError,
    getErrorStateByEntityId,
  };
}
