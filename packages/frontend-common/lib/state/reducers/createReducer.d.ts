export interface Action {
    type: string;
    payload?: any;
}
declare function createReducer<S>(initialState: S, handlers: {
    [id: string]: (state: S, payload?: any) => S;
}): (state: S | undefined, action: Action) => S;
export default createReducer;
//# sourceMappingURL=createReducer.d.ts.map