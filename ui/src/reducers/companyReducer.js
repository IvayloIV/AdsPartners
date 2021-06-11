import * as types from '../actions/actionTypes';

let companyState = { 
    list: [],
    filters: [],
    details: {},
    requests: [],
    history: []
};

export default (state = companyState, action) => {
    switch (action.type) {
        case types.COMPANIES_ADS:
        case types.COMPANIES_BY_RATING:
            return Object.assign({}, state, { list: action.data });
        case types.COMPANIES_FILTERS:
            return Object.assign({}, state, { filters: action.data });
        case types.GET_COMPANY_PROFILE:
        case types.GET_COMPANY_DETAILS:
            return Object.assign({}, state, { details: action.data });
        case types.REGISTER_REQUESTS:
            return Object.assign({}, state, { requests: action.data });
        case types.REGISTER_HISTORY:
            return Object.assign({}, state, { history: action.data });
        case types.UPDATE_REGISTER_STATUS:
            let requests = state.requests.filter(r => r.id !== action.data.id);
            let history = state.history.slice();
            history.unshift(action.data);
            return Object.assign({}, state, { requests, history });
        case types.BLOCK_AD:
        case types.UNBLOCK_AD:
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
};
