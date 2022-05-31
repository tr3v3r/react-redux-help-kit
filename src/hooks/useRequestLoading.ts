import {useSelector, useDispatch} from 'react-redux';
import {useCallback, useMemo} from 'react';

import {ReduxKitState} from '../redux-kit';
import {clearLoadingByActionType} from '../redux-kit/reducers';
import {Action} from './types';

export function useRequestLoading(action: Action): {
  loading: boolean;
  clearLoadingStatus: () => void;
} {
  const {type, meta} = typeof action === 'function' ? action() : action;
  const actionTypeKey = type.replace('_REQUEST', '');
  const key = `${actionTypeKey}${meta?.reducerId || ''}`;

  const dispatch = useDispatch();

  const clearLoadingStatus = useCallback(() => {
    dispatch(clearLoadingByActionType(key));
  }, [dispatch, key]);

  const loading = useSelector(
    (state: ReduxKitState) => state.loading[key] ?? false,
  );

  return useMemo(
    () => ({
      loading,
      clearLoadingStatus,
    }),
    [clearLoadingStatus, loading],
  );
}
