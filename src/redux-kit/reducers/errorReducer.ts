import {AnyAction} from 'redux';
import {ACTIONS} from '../../constants';
import {IError} from '../../types';
import {omit} from '../../utils';

export const clearErrorByActionType = (
  actionType: string,
  entityId: string | null,
) => ({
  type: ACTIONS.CLEAR_ERROR_BY_ACTION_TYPE,
  payload: {actionType, entityId},
});

export interface IErrorReducerState {
  [actionType: string]: {
    default: {error: IError | null; entityId: string | null};
    [entityId: string]: {error: IError | null; entityId: string | null};
  };
}

export const errorReducer = (
  state: IErrorReducerState = {},
  action: AnyAction,
): IErrorReducerState => {
  const {type, payload, meta} = action;

  if (type === ACTIONS.CLEAR_ERROR_BY_ACTION_TYPE) {
    const {actionType, entityId} = payload || {};

    if (!actionType) {
      return state;
    }
    if (!entityId) {
      return omit(state, [actionType]);
    }

    const newState = {
      ...state,
      [actionType]: omit(state[actionType] || {}, [entityId, 'default']),
    };

    return newState;
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
  };

  return {
    ...state,
    [key]: {
      ...(state[key] || {}),
      default: errorState,
      ...(meta?.entityId ? {[meta.entityId]: errorState} : {}),
    },
  };
};
