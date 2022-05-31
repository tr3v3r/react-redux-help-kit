import {mapValues} from './mapValues';
import {set} from './set';
import {ACTION_META_PROPERT_NAME} from '../constants';

export function addReducerIdToMeta<T extends Record<string, Function>>(
  actions: T,
  metaData: {reduxStateBranchName: string; reducerId: string},
): T {
  return mapValues(actions, value => {
    if (typeof value === 'function') {
      const foo = (...args) => {
        const action = value(...args);

        if (!action.meta) {
          return set(action, [ACTION_META_PROPERT_NAME], metaData);
        }

        if (!action.meta.reducerId) {
          set(action, [ACTION_META_PROPERT_NAME], metaData);
        }

        return set(
          action,
          [ACTION_META_PROPERT_NAME],
          addReducerIdToMeta(action.meta, metaData),
        );
      };
      return foo;
    }

    return value;
  });
}
