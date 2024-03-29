import {useSelector, useDispatch} from 'react-redux';
import {useCallback, useMemo} from 'react';

import {ReduxKitState} from '../redux-kit';
import {clearLoadingByActionType} from '../redux-kit/reducers';
import {Action} from './types';
import {some} from '../utils';
export function useRequestLoading(action: Action): {
  loading: boolean;
  clearLoadingStatus: () => void;
  getLoadingStateByEntityId: (entityId: string) => boolean;
} {
  const {type, meta} = typeof action === 'function' ? action() : action;
  const actionTypeKey = type.replace('_REQUEST', '');
  const key = `${actionTypeKey}${meta?.reducerId || ''}`;

  const dispatch = useDispatch();

  const clearLoadingStatus = useCallback(() => {
    dispatch(clearLoadingByActionType(key));
  }, [dispatch, key]);

  const loadingState = useSelector(
    (state: ReduxKitState) => state.loading[key],
  );

  const loading = some(loadingState || {}, Boolean);

  const getLoadingStateByEntityId = useCallback(
    (entityId: string) => {
      return Boolean(loadingState?.[entityId]);
    },
    [loadingState],
  );

  return useMemo(
    () => ({
      loading,
      clearLoadingStatus,
      getLoadingStateByEntityId,
    }),
    [clearLoadingStatus, getLoadingStateByEntityId, loading],
  );
}
