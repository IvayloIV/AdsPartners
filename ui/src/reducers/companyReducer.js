import { REGISTER_COMPANY_SUCCESS, LOGIN_COMPANY_SUCCESS, GET_ALL_COMPANIES } from '../actions/actionTypes';

let companyState = { 
    registerSuccess: false, 
    loginSuccess: false,
    list: []
};

export function companyReducer(state = companyState, action) {
    switch (action.type) {
        case REGISTER_COMPANY_SUCCESS:
            return Object.assign({}, state, { registerSuccess: true });
        case LOGIN_COMPANY_SUCCESS:
            return Object.assign({}, state, { loginSuccess: true });
        case GET_ALL_COMPANIES:
            return Object.assign({}, state, { list: action.data });
        default:
            return state;
    }
}