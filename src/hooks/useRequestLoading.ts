import {useSelector, useDispatch} from 'react-redux';
import {useCallback, useMemo} from 'react';

import {ReduxKitState} from '../redux-kit';
import {clearLoadingByActionType} from '../redux-kit/reducers';
import {Action} from './types';

export function useRequestLoading(action: Action): {
  loading: boolean;
  clearLoadingStatus: () => void;
} {
  const key = String(action).replace('_REQUEST', '');
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
