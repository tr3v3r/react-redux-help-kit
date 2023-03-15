import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useCallback, useLayoutEffect} from 'react';

import {ReduxKitState} from '../redux-kit';
import {
  clearSuccessByActionType,
  successSubscribers,
} from '../redux-kit/reducers';
import {Action} from './types';
import {useUpdateEffect} from './useUpdateEffect';
import {useStaticCallback} from './useStaticCallback';
import {find} from '../utils';

export function useOnRequestSuccess(
  action: Action,
  onSuccess?: (data: any, entityId: string | null) => void,
  autoClear: boolean = true,
) {
  const {type, meta} = typeof action === 'function' ? action() : action;
  const actionTypeKey = type.replace('_REQUEST', '');
  const key = `${actionTypeKey}${meta?.reducerId || ''}`;

  const dispatch = useDispatch();

  const clearSuccessStatus = useCallback(
    (entityId: string | null = null) => {
      dispatch(clearSuccessByActionType(key, entityId));
    },
    [dispatch, key],
  );

  const successState = useSelector((state: ReduxKitState) => {
    return state.success[key];
  });

  const {
    data = null,
    success = null,
    entityId = null,
  } = find(successState || {}, value => value.success !== null) || {};

  const staticSuccessCallback = useStaticCallback(() => {
    if (onSuccess) {
      onSuccess(data, entityId);
    }
  }, [onSuccess, data, entityId]);

  useLayoutEffect(() => {
    if (successSubscribers[key]) {
      successSubscribers[key] += 1;
    } else {
      successSubscribers[key] = 1;
    }

    return () => {
      successSubscribers[key] -= 1;
      if (successSubscribers[key] === 0) {
        delete successSubscribers[key];
      }
    };
  }, [dispatch, key]);

  useUpdateEffect(() => {
    if (success === true) {
      staticSuccessCallback();
      if (autoClear) {
        clearSuccessStatus(entityId);
      }
    }
  }, [clearSuccessStatus, staticSuccessCallback, success, autoClear, entityId]);

  useEffect(() => {
    return clearSuccessStatus;
  }, [clearSuccessStatus]);

  const getSuccessStateByEntityId = useCallback(
    (id: string) => {
      return (
        successState?.[id] || {
          data: null,
          success: null,
          entityId: null,
        }
      );
    },
    [successState],
  );

  return {
    success,
    clearSuccessStatus,
    data,
    getSuccessStateByEntityId,
  };
}
