import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useCallback, useLayoutEffect} from 'react';

import {ReduxKitState} from '../redux-kit';
import {
  clearSuccessByActionType,
  successSubscribers,
} from '../redux-kit/reducers';
import {Action} from './types';

export function useRequestSuccess(action: Action) {
  const {type, meta} = typeof action === 'function' ? action() : action;
  const actionTypeKey = type.replace('_REQUEST', '');
  const key = `${actionTypeKey}${meta?.reducerId || ''}`;

  const dispatch = useDispatch();

  const clearSuccessStatus = useCallback(() => {
    dispatch(clearSuccessByActionType(key));
  }, [dispatch, key]);

  const successState = useSelector((state: ReduxKitState) => {
    return state.success[key];
  });

  const {
    data = null,
    success = null,
    entityId = null,
    timestamp,
  } = successState || {};

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

  useEffect(() => {
    return clearSuccessStatus;
  }, [clearSuccessStatus]);

  return {
    success,
    clearSuccessStatus,
    data,
    entityId,
    timestamp,
  };
}
