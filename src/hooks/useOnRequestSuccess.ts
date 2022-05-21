import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useCallback, useMemo} from 'react';

import {ReduxKitState} from '../redux-kit';
import {clearSuccessByActionType} from '../redux-kit/reducers';
import {Action} from './types';
import {useUpdateEffect} from './useUpdateEffect';
import {useStaticCallback} from './useStaticCallback';

export function useOnRequestSuccess(
  action: Action,
  onSuccess?: Function,
  autoClear: boolean = true,
) {
  const key = String(action).replace('_REQUEST', '');
  const dispatch = useDispatch();

  const clearSuccessStatus = useCallback(() => {
    dispatch(clearSuccessByActionType(key));
  }, [dispatch, key]);

  const {data = null, success = null} =
    useSelector((state: ReduxKitState) => {
      return state.success[key] || null;
    }) || {};

  const staticSuccessCallback = useStaticCallback(() => {
    if (onSuccess) {
      onSuccess(data);
    }
  }, [onSuccess, data]);

  useUpdateEffect(() => {
    if (success === true) {
      staticSuccessCallback();

      if (autoClear) {
        clearSuccessStatus();
      }
    }
  }, [clearSuccessStatus, staticSuccessCallback, success, autoClear]);

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
