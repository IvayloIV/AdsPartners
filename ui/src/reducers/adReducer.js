import { AD_LIST, AD_FILTERS, CREATE_AD } from '../actions/actionTypes';

let adState = {
    list: {},
    filters: []
};

export function adReducer(state = adState, action) {
    console.log(action.data);
    switch (action.type) {
        case AD_LIST:
            return Object.assign({}, state, { list: action.data });
        case AD_FILTERS:
            return Object.assign({}, state, { filters: action.data });;
        case CREATE_AD:
            state.list.items.unshift(action.data);
            return state.list.slice(); //TODO: za ko mi e tui slice()??
        default:
            return state;
    }
}