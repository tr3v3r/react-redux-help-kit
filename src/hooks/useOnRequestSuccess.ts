import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useCallback, useMemo} from 'react';

import {ReduxKitState} from '../redux-kit';
import {clearSuccessByActionType} from '../redux-kit/reducers';
import {Action} from './types';

export function useOnRequestSuccess(
  action: Action,
  onSuccess: Function,
): {success: boolean | null; clearSuccessStatus: () => void} {
  const key = String(action).replace('_REQUEST', '');
  const dispatch = useDispatch();

  const clearSuccessStatus = useCallback(() => {
    dispatch(clearSuccessByActionType(key));
  }, [dispatch, key]);

  const {data = null, success = null} =
    useSelector((state: ReduxKitState) => {
      return state.success[key] || null;
    }) || {};

  useEffect(() => {
    if (success === true && typeof onSuccess === 'function') {
      onSuccess?.(data);
      clearSuccessStatus();
    }
  }, [clearSuccessStatus, data, onSuccess, success]);

  useEffect(() => {
    return clearSuccessStatus;
  }, [clearSuccessStatus]);

  return useMemo(
    () => ({
      success,
      clearSuccessStatus,
      data,
    }),
    [clearSuccessStatus, data, success],
  );
}
