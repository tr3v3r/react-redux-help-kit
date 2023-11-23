import {AnyAction} from 'redux';
import {ACTIONS} from '../../constants';
import {omit} from '../../utils';

export const clearSuccessByActionType = (actionType: string) => ({
  type: ACTIONS.CLEAR_SUCCESS_BY_ACTION_TYPE,
  payload: {actionType},
});

export const successSubscribers = {};

function getSuccessStatus(requestState: string) {
  if (requestState === 'SUCCESS') {
    return true;
  }
  if (requestState === 'FAILURE') {
    return false;
  }

  return null;
}

export interface ISuccessReducerState {
  [actionType: string]: {
    data: null | any;
    success: boolean | null;
    entityId: null | string;
  };
}

export const successReducer = (
  state: ISuccessReducerState = {},
  action: AnyAction,
): ISuccessReducerState => {
  const {type, payload, meta} = action;

  if (type === ACTIONS.CLEAR_SUCCESS_BY_ACTION_TYPE) {
    const {actionType} = payload || {};

    if (!actionType) {
      return state;
    }
    return omit(state, [actionType]);
  }

  const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type);

  if (!matches) {
    return state;
  }

  const [, requestName, requestState] = matches;
  const key = `${requestName}${meta?.reducerId || ''}`;

  if (!successSubscribers[key] || successSubscribers[key] <= 0) {
    return state;
  }

  const successState = {
    data: requestState === 'SUCCESS' ? payload : null,
    success: getSuccessStatus(requestState),
    entityId: meta?.entityId || null,
  };

  return {
    ...state,
    [key]: successState,
  };
};
