import { CREATE_AD } from '../actions/actionTypes';

export function adReducer(state = [], action) {
    switch (action.type) {
        case CREATE_AD:
            state.unshift(action.data);
            return state.slice(); //TODO: za ko mi e tui slice()??
        default:
            return state;
    }
}