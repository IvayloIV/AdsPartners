import { LOAD_USER_INFO, CHECK_SUBSCRIPTION, SUBSCRIBE, YOUTUBERS_BY_SUBS, YOUTUBERS_LIST, YOUTUBERS_FILTERS } from '../actions/actionTypes';

let youtubeUser = {
    name: '',
    isSubscriber: false,
    list: [],
    filters: []
};

export function youtubeReducer(state = youtubeUser, action) {
    switch (action.type) {
        case LOAD_USER_INFO:
            return Object.assign({}, state, { name: action.name });
        case CHECK_SUBSCRIPTION:
            return Object.assign({}, state, { isSubscriber: action.data });
        case SUBSCRIBE:
            return Object.assign({}, state, { isSubscriber: action.data });
        case YOUTUBERS_BY_SUBS:
            return Object.assign({}, state, { list: action.data });
        case YOUTUBERS_LIST:
            return Object.assign({}, state, { list: action.data });
        case YOUTUBERS_FILTERS:
            return Object.assign({}, state, { filters: action.data });
        default:
            return state;
    }
}