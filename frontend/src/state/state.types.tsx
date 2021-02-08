import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

export interface Plugin {
    name: string;
    src: string;
    enable: boolean;
    location: 'main' | 'left' | 'right';
}

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
