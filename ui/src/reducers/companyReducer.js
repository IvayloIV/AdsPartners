import { REGISTER_COMPANY_SUCCESS, LOGIN_COMPANY_SUCCESS, GET_ALL_COMPANIES, GET_SUBSCRIBERS, CHANGE_SUBSCRIBER_STATUS } from '../actions/actionTypes';

let companyState = { 
    registerSuccess: false, 
    loginSuccess: false,
    list: [],
    subscribers: []
};

export function companyReducer(state = companyState, action) {
    switch (action.type) {
        case REGISTER_COMPANY_SUCCESS:
            return Object.assign({}, state, { registerSuccess: true });
        case LOGIN_COMPANY_SUCCESS:
            return Object.assign({}, state, { loginSuccess: true });
        case GET_ALL_COMPANIES:
            return Object.assign({}, state, { list: action.data });
        case GET_SUBSCRIBERS:
            return Object.assign({}, state, { subscribers: action.data });
        case CHANGE_SUBSCRIBER_STATUS:
            let subs = state.subscribers.slice();
            let sub = subs.filter(s => s.youtuber.id === action.data.youtuberId)[0];
            sub.isBlocked = action.data.newStatus;
            return Object.assign({}, state, { subscribers: subs });
        default:
            return state;
    }
}