import { LOAD_USER_INFO, CHECK_SUBSCRIPTION, SUBSCRIBE, YOUTUBERS_BY_SUBS } from '../actions/actionTypes';

let youtubeUser = {
    name: '',
    isSubscriber: false,
    list: []
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
        default:
            return state;
    }
}