import {AnyAction, Reducer} from 'redux';

import {ACTIONS} from '../../constants';

export const removeReducerById = (payload: {
  reduxStateBranchName: string;
  reducerId: string;
}) => ({
  type: ACTIONS.REMOVE_REDUCER_BY_ID,
  payload: payload,
});

export function byIdReducer<S>(reduxStateBranchName: string) {
  return (reducer: Reducer) =>
    (
      state: {[id: string]: S; default: S},
      action: AnyAction,
    ): {[id: string]: S} => {
      if (!state) {
        return {
          default: reducer(state, action),
        };
      }

      if (
        action.type === ACTIONS.REMOVE_REDUCER_BY_ID &&
        action.payload.reduxStateBranchName === reduxStateBranchName
      ) {
        return Object.keys(state).reduce((acc, key) => {
          if (key === action.payload.reducerId) {
            return acc;
          }

          return {...acc, [key]: state[key]};
        }, {});
      }

      if (
        !action.meta ||
        action.meta?.reduxStateBranchName !== reduxStateBranchName
      ) {
        return state;
      }

      const id = action?.meta?.reducerId;

      if (!id) {
        return state;
      }

      const prevStateById: S = state?.[id];
      const nextStateById: S = reducer(prevStateById, action);

      if (nextStateById === prevStateById) {
        return state;
      }

      return {
        ...state,
        [id]: nextStateById,
      };
    };
}
