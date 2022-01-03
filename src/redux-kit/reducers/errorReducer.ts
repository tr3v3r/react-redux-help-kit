import {AnyAction} from 'redux';
import {ACTIONS} from '../constants';

export const clearErrorByActionType = (actionType: string) => ({
  type: ACTIONS.CLEAR_ERROR_BY_ACTION_TYPE,
  payload: actionType,
});

export interface IErrorReducerState {
  [actionType: string]: Error;
}

export const errorReducer = (
  state: IErrorReducerState = {},
  action: AnyAction,
): IErrorReducerState => {
  const {type, payload} = action;

  if (type === ACTIONS.CLEAR_ERROR_BY_ACTION_TYPE) {
    return {
      ...state,
      [payload]: null,
    };
  }

  const matches = /(.*)_(REQUEST|FAILURE)/.exec(type);
  if (!matches) {
    return state;
  }

  const [, requestName, requestState] = matches;
  return {
    ...state,
    [requestName]: requestState === 'FAILURE' ? payload : null,
  };
};
