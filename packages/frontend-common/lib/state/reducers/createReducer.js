function createReducer(initialState, handlers) {
    return function reducer(state, action) {
        if (state === void 0) { state = initialState; }
        if (action && Object.prototype.hasOwnProperty.call(handlers, action.type)) {
            return handlers[action.type](state, action.payload);
        }
        return state;
    };
}
export default createReducer;
/* eslint-enable @typescript-eslint/no-explicit-any */
//# sourceMappingURL=createReducer.js.map