import {AnyAction} from 'redux';
import {ACTIONS} from '../../constants';
import {IError} from '../../types';
import {omit} from '../../utils';

export const clearErrorByActionType = (actionType: string) => ({
  type: ACTIONS.CLEAR_ERROR_BY_ACTION_TYPE,
  payload: {actionType},
});

export interface IErrorReducerState {
  [actionType: string]: {
    error: IError | null;
    entityId: string | null;
    timestamp: number;
  };
}

export const errorReducer = (
  state: IErrorReducerState = {},
  action: AnyAction,
): IErrorReducerState => {
  const {type, payload, meta} = action;

  if (type === ACTIONS.CLEAR_ERROR_BY_ACTION_TYPE) {
    const {actionType} = payload || {};

    if (!actionType) {
      return state;
    }

    return omit(state, [actionType]);
  }

  const matches = /(.*)_(REQUEST|FAILURE)/.exec(type);
  if (!matches) {
    return state;
  }

  const [, requestName, requestState] = matches;
  const key = `${requestName}${meta?.reducerId || ''}`;

  const errorState = {
    error: requestState === 'FAILURE' ? (payload as IError) : null,
    entityId: meta?.entityId || null,
    timestamp: Date.now(),
  };

  return {
    ...state,
    [key]: errorState,
  };
};
