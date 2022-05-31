import {AnyAction} from 'redux';

import {ACTIONS} from '../../constants';

export const clearLoadingByActionType = (actionType: string) => ({
  type: ACTIONS.CLEAR_SUCCESS_BY_ACTION_TYPE,
  payload: actionType,
});

export interface ILoadingReducerState {
  [actionType: string]: boolean;
}

export const loadingReducer = (
  state: ILoadingReducerState = {},
  action: AnyAction,
): ILoadingReducerState => {
  const {type, payload, meta} = action;

  if (type === ACTIONS.CLEAR_LOADING_BY_ACTION_TYPE) {
    return {
      ...state,
      [payload]: false,
    };
  }

  const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type);

  if (!matches) {
    return state;
  }

  const [, requestName, requestState] = matches;
  const key = `${requestName}${meta?.reducerId || ''}`;

  return {
    ...state,
    [key]: requestState === 'REQUEST',
  };
};
