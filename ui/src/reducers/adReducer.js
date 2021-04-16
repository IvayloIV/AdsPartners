import { AD_LIST, AD_DETAILS, AD_FILTERS, CREATE_AD, AD_APPLICATIONS } from '../actions/actionTypes';

let adState = {
    list: {},
    details: {},
    applications: [],
    filters: []
};

export function adReducer(state = adState, action) {
    console.log(action.data);
    switch (action.type) {
        case AD_LIST:
            return Object.assign({}, state, { list: action.data });
        case AD_DETAILS:
            return Object.assign({}, state, { details: action.data });
        case AD_FILTERS:
            return Object.assign({}, state, { filters: action.data });;
        case CREATE_AD:
            state.list.items.unshift(action.data);
            return state.list.slice(); //TODO: za ko mi e tui slice()??
        case AD_APPLICATIONS:
            return Object.assign({}, state, { applications: action.data });;
        default:
            return state;
    }
}