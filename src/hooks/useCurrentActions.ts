import {useMemo} from 'react';

import {addReducerIdToMeta} from '../utils';

export function useCurrentActions<T extends Record<string, Function>>(
  actions: T,
  reduxStateBranchName: string,
  reducerId: string,
): T {
  return useMemo(
    () => addReducerIdToMeta(actions, {reduxStateBranchName, reducerId}),
    [actions, reducerId, reduxStateBranchName],
  );
}
