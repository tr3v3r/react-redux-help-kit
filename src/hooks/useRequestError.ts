import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useCallback, useMemo} from 'react';

import {ReduxKitState} from '../redux-kit';
import {clearErrorByActionType} from '../redux-kit/reducers';
import {Action} from './types';
import {IError} from '../types';

export function useRequestError<T extends IError>(
  action: Action,
): {
  error: T | null;
  clearError: () => void;
} {
  const key = String(action).replace('_REQUEST', '');
  const dispatch = useDispatch();

  const clearError = useCallback(() => {
    dispatch(clearErrorByActionType(key));
  }, [dispatch, key]);

  useEffect(() => {
    return clearError;
  }, [clearError]);

  const error = useSelector(
    (state: ReduxKitState) => state.error[key] || null,
  ) as T;

  return useMemo(
    () => ({
      error,
      clearError,
    }),
    [clearError, error],
  );
}
