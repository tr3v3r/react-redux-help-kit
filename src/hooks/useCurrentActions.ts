import {useMemo} from 'react';

import {addReducerIdToMeta} from '../utils';

export function useCurrentActions<T extends Record<string, Function>>(
  actions: T,
  {
    reducerId,
    reduxStateBranchName,
  }: {
    reducerId: string;
    reduxStateBranchName: string;
  },
): T {
  return useMemo(
    () => addReducerIdToMeta(actions, {reduxStateBranchName, reducerId}),
    [actions, reducerId, reduxStateBranchName],
  );
}
