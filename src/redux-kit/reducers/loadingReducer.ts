import {AnyAction} from 'redux';

import {ACTIONS} from '../../constants';
import {omit} from '../../utils';

export const clearLoadingByActionType = (actionType: string) => ({
  type: ACTIONS.CLEAR_LOADING_BY_ACTION_TYPE,
  payload: actionType,
});

export interface ILoadingReducerState {
  [actionType: string]: {
    default: boolean;
    [entityId: string]: boolean;
  };
}

export const loadingReducer = (
  state: ILoadingReducerState = {},
  action: AnyAction,
): ILoadingReducerState => {
  const {type, payload, meta} = action;

  if (type === ACTIONS.CLEAR_LOADING_BY_ACTION_TYPE) {
    return omit(state, [payload]);
  }

  const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type);

  if (!matches) {
    return state;
  }

  const [, requestName, requestState] = matches;
  const key = `${requestName}${meta?.reducerId || ''}`;

  return {
    ...state,
    [key]: {
      ...(state[key] || {}),
      default: requestState === 'REQUEST',
      ...(meta?.entityId ? {[meta.entityId]: requestState === 'REQUEST'} : {}),
    },
  };
};
