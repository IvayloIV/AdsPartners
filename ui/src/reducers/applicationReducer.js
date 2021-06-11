import * as types from '../actions/actionTypes';

let adState = {
    list: []
};

export default (state = adState, action) => {
    switch (action.type) {
        case types.AD_APPLICATIONS:
        case types.COMPANY_APPLICATIONS_LIST:
        case types.YOUTUBER_APPLICATIONS:
            return Object.assign({}, state, { list: action.data });
        default:
            return state;
    }
};
