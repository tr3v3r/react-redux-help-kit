import {useDispatch, ReactReduxContext} from 'react-redux';
import {
  useEffect,
  useCallback,
  useLayoutEffect,
  useContext,
  useRef,
} from 'react';

import {ReduxKitState} from '../redux-kit';
import {
  clearSuccessByActionType,
  successSubscribers,
} from '../redux-kit/reducers';
import {Action} from './types';
import {useStaticCallback} from './useStaticCallback';
import {ISuccessReducerState} from '../redux-kit/reducers/successReducer';

export function useOnRequestSuccess(
  action: Action,
  callback?: (data: any, entityId: string | null) => void,
  autoClear: boolean = true,
) {
  const {store} = useContext(ReactReduxContext);
  const {type, meta} = typeof action === 'function' ? action() : action;
  const actionTypeKey = type.replace('_REQUEST', '');
  const key = `${actionTypeKey}${meta?.reducerId || ''}`;
  const prevSuccessState = useRef({});

  const dispatch = useDispatch();

  const clearSuccessStatus = useCallback(() => {
    dispatch(clearSuccessByActionType(key));
  }, [dispatch, key]);

  const getSuccessState = useCallback(() => {
    const state: ReduxKitState = store.getState();
    const errorState = state.success[key];

    return errorState;
  }, [key, store]);

  const getSuccessData = useCallback(
    (successState: ISuccessReducerState[string]) => {
      const {data = null, success = null, entityId = null} = successState || {};

      return {
        data,
        success,
        entityId,
      };
    },
    [],
  );

  const staticSuccessCallback = useStaticCallback(
    (successState: ISuccessReducerState[string]) => {
      const {data, entityId, success} = getSuccessData(successState);
      if (callback && success === true) {
        callback(data, entityId);
        if (autoClear) {
          clearSuccessStatus();
        }
      }
    },
    [callback, getSuccessData, autoClear, clearSuccessStatus],
  );

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
    const unsubscribe = store.subscribe(() => {
      const successState = getSuccessState();

      const isStateUpdated =
        successState && prevSuccessState.current !== successState;

      prevSuccessState.current = successState;

      if (isStateUpdated) {
        staticSuccessCallback(successState);
      }
    });

    return unsubscribe;
  }, [getSuccessState, staticSuccessCallback, store]);

  useEffect(() => {
    return clearSuccessStatus;
  }, [clearSuccessStatus]);
}
