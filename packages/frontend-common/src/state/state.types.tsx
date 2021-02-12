import { RouterState } from 'connected-react-router';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RegisterRoutePayload } from './frontend.types';

export interface Plugin {
    name: string;
    src: string;
    enable: boolean;
    // location: 'main' | 'left' | 'right';
}

export interface FrontendState {
    notifications: string[];
    plugins: RegisterRoutePayload[];
    runId: number;
}

export interface StateType {
    frontend: FrontendState;
    router: RouterState;
}

export interface ActionType<T> {
    type: string;
    payload: T;
}

export type ThunkResult<R> = ThunkAction<R, StateType, null, AnyAction>;
