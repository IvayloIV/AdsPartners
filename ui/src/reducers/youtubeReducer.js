import { LOAD_USER_INFO, CHECK_SUBSCRIPTION, SUBSCRIBE } from '../actions/actionTypes';

let youtubeUser = {
    name: '',
    isSubscriber: false
};

export function youtubeReducer(state = youtubeUser, action) {
    switch (action.type) {
        case LOAD_USER_INFO:
            return Object.assign({}, state, { name: action.name });
        case CHECK_SUBSCRIPTION:
            return Object.assign({}, state, { isSubscriber: action.data });
        case SUBSCRIBE:
            return Object.assign({}, state, { isSubscriber: action.data });
        default:
            return state;
    }
}