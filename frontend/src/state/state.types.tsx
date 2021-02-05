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
