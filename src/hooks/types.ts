import {AnyAction} from 'redux';

type ActionCreator = (...args: any[]) => AnyAction;
export type Action = AnyAction | ActionCreator;
