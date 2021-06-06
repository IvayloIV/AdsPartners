import { GET_ALL_COMPANIES, GET_SUBSCRIBERS, 
    CHANGE_SUBSCRIBER_STATUS, GET_COMPANY_DETAILS, GET_COMPANY_PROFILE,
    REGISTER_REQUESTS, REGISTER_HISTORY, UPDATE_REGISTER_STATUS, COMPANIES_BY_RATING,
    COMPANIES_FILTERS, COMPANIES_ADS, BLOCK_AD, UNBLOCK_AD } from '../actions/actionTypes';

let companyState = { 
    list: [],
    subscribers: [],
    details: {},
    requests: [],
    history: [],
    filters: []
};

export function companyReducer(state = companyState, action) {
    switch (action.type) {
        case GET_ALL_COMPANIES:
            return Object.assign({}, state, { list: action.data });
        case COMPANIES_BY_RATING:
            return Object.assign({}, state, { list: action.data });
        case COMPANIES_ADS:
            return Object.assign({}, state, { list: action.data });
        case COMPANIES_FILTERS:
            return Object.assign({}, state, { filters: action.data });
        case GET_SUBSCRIBERS:
            return Object.assign({}, state, { subscribers: action.data });
        case CHANGE_SUBSCRIBER_STATUS:
            let subs = state.subscribers.filter(s => s.youtuber.id !== action.data.youtuberId);
            let sub = state.subscribers.filter(s => s.youtuber.id === action.data.youtuberId)[0];
            sub.isBlocked = action.data.newStatus;
            subs.unshift(sub);
            return Object.assign({}, state, { subscribers: subs });
        case GET_COMPANY_DETAILS:
        case GET_COMPANY_PROFILE:
            return Object.assign({}, state, { details: action.data });
        case REGISTER_REQUESTS:
            return Object.assign({}, state, { requests: action.data });
        case REGISTER_HISTORY:
            return Object.assign({}, state, { history: action.data });
        case UPDATE_REGISTER_STATUS:
            let requests = state.requests.filter(r => r.id !== action.data.id);
            let history = state.history.slice();
            history.unshift(action.data);
            return Object.assign({}, state, { requests, history });
        case BLOCK_AD:
        case UNBLOCK_AD:
            let list = Object.assign({}, state.list);
            let ad = list.items
                .filter(c => c.ads.some(a => a.id === action.adId))
                .map(c => c.ads)[0]
                .filter(a => a.id === action.adId)[0];
            ad.isBlocked = !ad.isBlocked;
            return Object.assign({}, state, { list });
        default:
            return state;
    }
}