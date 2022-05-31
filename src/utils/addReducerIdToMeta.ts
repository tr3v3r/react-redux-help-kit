import {mapValues} from './mapValues';
import {ACTION_META_PROPERT_NAME} from '../constants';

export function addReducerIdToMeta<T extends Record<string, Function>>(
  actions: T,
  metaData: {reduxStateBranchName: string; reducerId: string},
): T {
  return mapValues(actions, value => {
    if (typeof value === 'function') {
      const foo = (...args) => {
        let action = value(...args);

        if (!action.meta) {
          return {
            ...action,
            [ACTION_META_PROPERT_NAME]: metaData,
          };
        }

        if (!action.meta.reducerId) {
          action = {
            ...action,
            [ACTION_META_PROPERT_NAME]: {
              ...action[ACTION_META_PROPERT_NAME],
              ...metaData,
            },
          };
        }

        return {
          ...action,
          [ACTION_META_PROPERT_NAME]: {
            ...action[ACTION_META_PROPERT_NAME],
            ...addReducerIdToMeta(action[ACTION_META_PROPERT_NAME], metaData),
          },
        };
      };
      return foo;
    }

    return value;
  });
}
