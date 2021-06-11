import * as types from '../actions/actionTypes';

let youtubeUser = {
    list: [],
    details: {}
};

export default (state = youtubeUser, action) => {
    switch (action.type) {
        case types.YOUTUBERS_BY_SUBS:
            return Object.assign({}, state, { list: action.data });
        case types.YOUTUBER_PROFILE:
        case types.YOUTUBER_DETAILS:
            return Object.assign({}, state, { details: action.data });
        default:
            return state;
    }
};
