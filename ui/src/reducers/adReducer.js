import * as types from '../actions/actionTypes';

let adState = {
    list: {},
    filters: [],
    details: {}
};

export default (state = adState, action) => {
    switch (action.type) {
        case types.AD_LIST:
        case types.AD_COMPANY_LIST:
            return Object.assign({}, state, { list: action.data });
        case types.AD_FILTERS:
            return Object.assign({}, state, { filters: action.data });
        case types.AD_DETAILS:
            return Object.assign({}, state, { details: action.data });
        case types.DELETE_AD:
            let items = state.list.items.filter(a => a.id !== action.data);
            let list = state.list;
            list.items = items;
            return Object.assign({}, state, { list });
        case types.VOTE_FOR_AD:
            let adList = state.list;
            let adItems = adList.items;
            if (adItems !== undefined) {
                let ad = adItems.filter(i => i.id === action.data.adId)[0];
                ad.ratingResponse = action.data;
                adList.items = adItems;
            }
            return Object.assign({}, state, { list: adList });
        default:
            return state;
    }
};
