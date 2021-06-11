import * as types from '../actions/actionTypes';

let youtubeUser = {
    list: [],
    isSubscriber: false
};

export default (state = youtubeUser, action) => {
    switch (action.type) {
        case types.GET_SUBSCRIBERS:
            return Object.assign({}, state, { list: action.data });
        case types.SUBSCRIBE:
        case types.CHECK_SUBSCRIPTION:
            return Object.assign({}, state, { isSubscriber: action.data });
        case types.CHANGE_SUBSCRIBER_STATUS:
            let subs = state.list.filter(s => s.youtuber.id !== action.data.youtuberId);
            let sub = state.list.filter(s => s.youtuber.id === action.data.youtuberId)[0];
            sub.isBlocked = action.data.newStatus;
            subs.unshift(sub);
            return Object.assign({}, state, { list: subs });
        default:
            return state;
    }
};
