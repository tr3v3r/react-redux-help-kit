import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useCallback} from 'react';

import {ReduxKitState} from '../redux-kit';
import {clearErrorByActionType} from '../redux-kit/reducers';
import {Action} from './types';
import {IError} from '../types';

export function useRequestError<T extends IError>(
  action: Action,
): {
  error: T | null;
  clearError: (entityId?: string | null) => void;
  entityId: string | null;
} {
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

  const errorState = useSelector((state: ReduxKitState) => state.error[key]);

  const {error = null, entityId = null} = errorState || {};

  return {
    error: error as T,
    clearError,
    entityId,
  };
}
