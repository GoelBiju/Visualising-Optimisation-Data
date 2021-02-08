import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

export interface FrontendState {
    notifications: string[];
}

export interface StateType {
    frontend: FrontendState;
}

export interface ActionType<T> {
    type: string;
    payload: T;
}

export type ThunkResult<R> = ThunkAction<R, StateType, null, AnyAction>;
