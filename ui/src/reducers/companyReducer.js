import { REGISTER_COMPANY_SUCCESS, LOGIN_COMPANY_SUCCESS } from '../actions/actionTypes';

export function companyReducer(state = { registerSuccess: false, loginSuccess: false }, action) {
    switch (action.type) {
        case REGISTER_COMPANY_SUCCESS:
            return Object.assign({}, state, { registerSuccess: true });
        case LOGIN_COMPANY_SUCCESS:
            return Object.assign({}, state, { loginSuccess: true });
        default:
            return state;
    }
}