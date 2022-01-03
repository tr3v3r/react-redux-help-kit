import {StateType} from './redux-kit';
import {asyncReducers} from './index';

export type ReduxKitState = StateType<typeof asyncReducers>;
