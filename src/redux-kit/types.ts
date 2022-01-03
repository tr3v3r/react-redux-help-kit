import {AnyAction} from 'redux';

/**
 * @desc Type representing Generic Reducer
 */
export type Reducer<TState, TAction extends AnyAction> = (
  state: TState | undefined,
  action: TAction,
) => TState;
/**
 * @desc Action without Payload
 */

export type StateType<TReducerOrMap extends any> =
  TReducerOrMap extends Reducer<any, any>
    ? ReturnType<TReducerOrMap>
    : TReducerOrMap extends Record<any, any>
    ? {
        [K in keyof TReducerOrMap]: StateType<TReducerOrMap[K]>;
      }
    : never;
