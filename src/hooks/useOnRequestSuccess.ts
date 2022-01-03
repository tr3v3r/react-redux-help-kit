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

  const success = useSelector(
    (state: ReduxKitState) => state.success[key] || null,
  );

  useEffect(() => {
    if (success === true && typeof onSuccess === 'function') {
      onSuccess?.();
      clearSuccessStatus();
    }
  }, [clearSuccessStatus, onSuccess, success]);

  useEffect(() => {
    return clearSuccessStatus;
  }, [clearSuccessStatus]);

  return useMemo(
    () => ({
      success,
      clearSuccessStatus,
    }),
    [clearSuccessStatus, success],
  );
}
