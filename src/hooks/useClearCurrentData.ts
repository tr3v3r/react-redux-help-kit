import {useDispatch} from 'react-redux';
import {useCallback} from 'react';
import {removeReducerById} from '../redux-kit/reducers';
import {subscribers} from './useCurrentDataSelector';

export function useClearCurrentData({
  reducerId,
  reduxStateBranchName,
}: {
  reducerId: string;
  reduxStateBranchName: string;
}) {
  const dispatch = useDispatch();

  const getIsDataCouldBeCleared = useCallback(() => {
    return !subscribers[reducerId];
  }, [reducerId]);

  const clearCurrentData = useCallback(() => {
    if (getIsDataCouldBeCleared()) {
      dispatch(removeReducerById({reduxStateBranchName, reducerId: reducerId}));
    }
  }, [dispatch, getIsDataCouldBeCleared, reducerId, reduxStateBranchName]);

  return {
    getIsDataCouldBeCleared,
    clearCurrentData,
  };
}
