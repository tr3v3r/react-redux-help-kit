import {AnyAction} from 'redux';
import {ACTIONS} from '../constants';

export const clearSuccessByActionType = (actionType: string) => ({
  type: ACTIONS.CLEAR_SUCCESS_BY_ACTION_TYPE,
  payload: actionType,
});

export interface ISuccessReducerState {
  [actionType: string]:
    | {
        data: null | any;
        success: boolean | null;
      }
    | undefined;
}

export const successReducer = (
  state: ISuccessReducerState = {},
  action: AnyAction,
): ISuccessReducerState => {
  const {type, payload} = action;

  if (type === ACTIONS.CLEAR_SUCCESS_BY_ACTION_TYPE) {
    return {
      ...state,
      [payload]: null,
    };
  }

  const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type);
  if (!matches) {
    return state;
  }

  const [, requestName, requestState] = matches;
  return {
    ...state,

    [requestName]: {
      data: requestState === 'SUCCESS' ? payload : null,
      success:
        (requestState === 'REQUEST' && null) ||
        (requestState === 'SUCCESS' && true) ||
        (requestState === 'FAILURE' && false),
    },
  };
};
