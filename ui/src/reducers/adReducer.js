import { DELETE_AD, AD_LIST, AD_DETAILS, AD_FILTERS, AD_APPLICATIONS, AD_COMPANY_LIST, 
    COMPANY_APPLICATIONS_LIST, YOUTUBER_APPLICATIONS, VOTE_FOR_AD } from '../actions/actionTypes';

let adState = {
    list: {},
    details: {},
    applications: [],
    filters: []
};

export function adReducer(state = adState, action) {
    switch (action.type) {
        case DELETE_AD:
            let items = state.list.items.filter(a => a.id !== action.data);
            let list = Object.assign({}, state.list);
            list.items = items;
            return Object.assign({}, state, { list });
        case AD_LIST:
            return Object.assign({}, state, { list: action.data });
        case VOTE_FOR_AD:
            let adList = Object.assign({}, state.list);
            let adItems = adList.items;
            let ad = adItems.filter(i => i.id == action.data.adId)[0];
            ad.ratingResponse = action.data;
            adList.items = adItems;
            return Object.assign({}, state, { list: adList });
        case AD_COMPANY_LIST:
            return Object.assign({}, state, { list: action.data });
        case AD_DETAILS:
            return Object.assign({}, state, { details: action.data });
        case AD_FILTERS:
            return Object.assign({}, state, { filters: action.data });
        case YOUTUBER_APPLICATIONS:
            return Object.assign({}, state, { applications: action.data });
        case COMPANY_APPLICATIONS_LIST:
            return Object.assign({}, state, { applications: action.data });
        case AD_APPLICATIONS:
            return Object.assign({}, state, { applications: action.data });
        default:
            return state;
    }
}